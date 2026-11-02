import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const EYE_HEIGHT = 1.68
const BODY_HEIGHT = 1.72
const PLAYER_RADIUS = 0.34
const STEP_HEIGHT = 0.5
const WALK_SPEED = 2.7
const RUN_SPEED = 5.2
const GRAVITY = 20
const MOUSE_SENSITIVITY = 0.0022
const TOUCH_SENSITIVITY = 0.0048

const clampPitch = value => Math.max(-1.35, Math.min(1.35, value))

export default function GlbModelViewer({ src, title, onClose, walkable = false }) {
  const mountRef = useRef(null)
  const apiRef = useRef(null)
  const inputRef = useRef({ joyX: 0, joyY: 0 })
  const joystickBaseRef = useRef(null)
  const joystickKnobRef = useRef(null)
  const joystickPointerRef = useRef(null)
  const modeRef = useRef('orbit')
  const coarseRef = useRef(false)
  const exitWalkRef = useRef(() => {})
  const overlayRef = useRef(null)
  const hintTimerRef = useRef(null)
  const [status, setStatus] = useState({ phase: 'loading', progress: 0, processing: false, error: '' })
  const [mode, setMode] = useState('orbit')
  const [locked, setLocked] = useState(false)
  const [coarsePointer, setCoarsePointer] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [controlsHintVisible, setControlsHintVisible] = useState(true)

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)')
    const update = () => {
      coarseRef.current = media.matches
      setCoarsePointer(media.matches)
    }
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (status.phase !== 'ready') return undefined
    setControlsHintVisible(true)
    const timer = window.setTimeout(() => setControlsHintVisible(false), 7000)
    hintTimerRef.current = timer
    return () => window.clearTimeout(timer)
  }, [status.phase, mode])

  useEffect(() => {
    const element = overlayRef.current
    const onChange = () => {
      const active = document.fullscreenElement === element
      setExpanded(active)
      if (!active) {
        try { screen.orientation?.unlock?.() } catch {}
      }
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      if (element && document.fullscreenElement === element) document.exitFullscreen?.().catch(() => {})
      try { screen.orientation?.unlock?.() } catch {}
    }
  }, [])

  const toggleExpanded = async () => {
    const element = overlayRef.current
    if (!element) return
    if (document.fullscreenElement) {
      try { await document.exitFullscreen?.() } catch {}
      return
    }
    if (expanded) {
      setExpanded(false)
      return
    }
    if (element.requestFullscreen) {
      try {
        await element.requestFullscreen()
        setExpanded(true)
        if (coarsePointer) {
          try { await screen.orientation?.lock?.('landscape') } catch {}
        }
        return
      } catch {}
    }
    setExpanded(true)
  }

  useEffect(() => {
    modeRef.current = mode
    apiRef.current?.setMode(mode)
    if (mode !== 'walk') {
      inputRef.current.joyX = 0
      inputRef.current.joyY = 0
      joystickPointerRef.current = null
      if (joystickKnobRef.current) joystickKnobRef.current.style.transform = 'translate(0px, 0px)'
    }
  }, [mode])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    let disposed = false
    let animationFrame = 0
    let model = null
    let colliders = []
    let repeatedInstances = []
    let orbitNear = 0.01
    let orbitFar = 10000

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b1220)

    const width = Math.max(mount.clientWidth, 1)
    const height = Math.max(mount.clientHeight, 1)
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.01, 10000)
    camera.position.set(0, 1, 4)
    camera.rotation.order = 'YXZ'

    const lowPower = coarseRef.current || navigator.connection?.saveData === true || (navigator.deviceMemory && navigator.deviceMemory <= 4)
    const renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: false, powerPreference: lowPower ? 'low-power' : 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5))
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = lowPower ? 0.9 : 1.0
    mount.appendChild(renderer.domElement)
    const canvas = renderer.domElement

    scene.add(new THREE.HemisphereLight(0xe8e4d8, 0x34302a, lowPower ? 0.72 : 0.86))
    const keyLight = new THREE.DirectionalLight(0xfff3df, lowPower ? 0.98 : 1.15)
    keyLight.position.set(3, 5, 6)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xb9c9e0, lowPower ? 0.17 : 0.24)
    fillLight.position.set(-4, 1, -3)
    scene.add(fillLight)
    const ambient = new THREE.AmbientLight(0xffebca, 0.12)
    scene.add(ambient)
    const lamp = new THREE.PointLight(0xffd9a8, lowPower ? 3.5 : 5.5, 12, 2)
    lamp.visible = false
    scene.add(lamp)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.autoRotate = !lowPower
    controls.autoRotateSpeed = 0.55
    controls.screenSpacePanning = true
    let scheduleRender = () => {}
    controls.addEventListener('change', () => scheduleRender())

    const walk = {
      active: false,
      unit: 1,
      maxDim: 40,
      floorY: 0,
      pos: new THREE.Vector3(),
      feet: 0,
      vy: 0,
      yaw: 0,
      pitch: 0,
      spawn: new THREE.Vector3(),
      spawnYaw: 0,
    }
    const orbitView = { position: new THREE.Vector3(), target: new THREE.Vector3() }

    const insideFootprint = (box, x, z, pad = 0) => (
      x >= box.min.x - pad && x <= box.max.x + pad && z >= box.min.z - pad && z <= box.max.z + pad
    )

    function surfaceUnder(x, z, maxY, pad) {
      let best = -Infinity
      for (let i = 0; i < colliders.length; i += 1) {
        const box = colliders[i]
        if (box.max.y > maxY || box.max.y <= best) continue
        if (insideFootprint(box, x, z, pad)) best = box.max.y
      }
      return best
    }

    function groundHeightAt(x, z, feetY) {
      return surfaceUnder(x, z, feetY + STEP_HEIGHT * walk.unit, PLAYER_RADIUS * walk.unit * 0.5)
    }

    function blockedAt(x, z, feetY) {
      const radius = PLAYER_RADIUS * walk.unit
      const low = feetY + STEP_HEIGHT * walk.unit
      const high = feetY + BODY_HEIGHT * walk.unit
      for (let i = 0; i < colliders.length; i += 1) {
        const box = colliders[i]
        if (box.max.y <= low || box.min.y >= high) continue
        if (box.max.y - box.min.y < 0.02 * walk.unit) continue
        if (!insideFootprint(box, x, z, radius)) continue
        if (insideFootprint(box, walk.pos.x, walk.pos.z)) continue
        return true
      }
      return false
    }

    const resetWalkPosition = () => {
      const unit = walk.unit
      walk.pos.set(walk.spawn.x, 0, walk.spawn.z)
      walk.feet = walk.spawn.y
      walk.vy = 0
      walk.yaw = walk.spawnYaw
      walk.pitch = 0
      camera.position.set(walk.spawn.x, walk.feet + EYE_HEIGHT * unit, walk.spawn.z)
      camera.rotation.set(walk.pitch, walk.yaw, 0)
      lamp.position.copy(camera.position)
      inputRef.current.joyX = 0
      inputRef.current.joyY = 0
      if (joystickKnobRef.current) joystickKnobRef.current.style.transform = 'translate(0px, 0px)'
    }

    const applyMode = nextMode => {
      if (!model) return
      if (nextMode === 'walk' && !walkable) return
      const enteringWalk = nextMode === 'walk'
      walk.active = enteringWalk
      controls.enabled = !enteringWalk
      controls.autoRotate = !enteringWalk && !lowPower
      lamp.visible = enteringWalk
      ambient.intensity = enteringWalk ? 0.24 : 0.12
      if (enteringWalk) {
        resetWalkPosition()
        camera.near = Math.max(0.05 * walk.unit, 0.001)
        camera.far = Math.max(walk.maxDim * 30, 100)
        camera.updateProjectionMatrix()
      } else {
        if (document.pointerLockElement === canvas) document.exitPointerLock?.()
        setLocked(false)
        camera.near = orbitNear
        camera.far = orbitFar
        camera.updateProjectionMatrix()
        camera.position.copy(orbitView.position)
        controls.target.copy(orbitView.target)
        controls.update()
      }
      scheduleRender()
    }

    const requestLock = () => {
      if (!walk.active || coarseRef.current || document.pointerLockElement === canvas) return
      const request = canvas.requestPointerLock?.()
      if (request?.catch) request.catch(() => {})
    }

    apiRef.current = {
      setMode: applyMode,
      resetWalk: () => { if (walk.active) { resetWalkPosition(); scheduleRender() } },
      requestLock,
      requestRender: () => scheduleRender(),
    }

    const loader = new GLTFLoader()
    loader.load(
      src,
      gltf => {
        if (disposed) return
        model = gltf.scene
        // The exported Blender point lights carry converted watt values in the tens of
        // thousands. The viewer supplies its own calibrated lights, so disable GLB lights.
        model.traverse(object => {
          if (object.isLight) object.visible = false
        })
        model.updateMatrixWorld(true)
        scene.add(model)

        const bounds = new THREE.Box3().setFromObject(model)
        const size = bounds.getSize(new THREE.Vector3())
        const center = bounds.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z, 0.01)
        const unit = maxDim > 8 ? 1 : Math.max(maxDim / 40, 0.001)
        walk.unit = unit
        walk.maxDim = maxDim
        walk.floorY = bounds.min.y

        colliders = []
        if (walkable) {
          model.traverse(object => {
            if (!object.isMesh || !object.geometry) return
            if (!object.geometry.boundingBox) object.geometry.computeBoundingBox()
            const box = object.geometry.boundingBox.clone().applyMatrix4(object.matrixWorld)
            if (!Number.isFinite(box.min.x) || !Number.isFinite(box.max.x)) return
            const colliderSize = box.getSize(new THREE.Vector3())
            const footprint = colliderSize.x * colliderSize.z
            const floorSurface = colliderSize.y <= 0.65 * unit && footprint >= 1.2 * unit * unit
            const architecturalObstacle = colliderSize.y >= 0.9 * unit && footprint >= 0.45 * unit * unit
            if (floorSurface || architecturalObstacle) colliders.push(box)
          })
        }

        // The GLB contains many linked copies of the same architectural details and
        // pew parts. Draw each repeated geometry/material pair as one GPU instanced mesh.
        const repeatedMeshes = new Map()
        model.traverse(object => {
          if (!object.isMesh || object.isSkinnedMesh || object.morphTargetInfluences || Array.isArray(object.material)) return
          const key = `${object.geometry.uuid}:${object.material.uuid}`
          const group = repeatedMeshes.get(key) || []
          group.push(object)
          repeatedMeshes.set(key, group)
        })
        repeatedMeshes.forEach((objects, key) => {
          if (objects.length < 2) return
          const first = objects[0]
          const batch = new THREE.InstancedMesh(first.geometry, first.material, objects.length)
          batch.name = `Instanced GLB detail ${key}`
          batch.matrixAutoUpdate = false
          batch.matrix.identity()
          batch.instanceMatrix.setUsage(THREE.StaticDrawUsage)
          scene.add(batch)
          batch.updateMatrixWorld(true)
          objects.forEach((object, index) => {
            batch.setMatrixAt(index, object.matrixWorld)
            object.visible = false
          })
          batch.instanceMatrix.needsUpdate = true
          batch.computeBoundingBox()
          batch.computeBoundingSphere()
          repeatedInstances.push(batch)
        })

        const spawnX = center.x
        const spawnZ = bounds.max.z - size.z * 0.16
        const probe = bounds.min.y + Math.min(size.y * 0.25, 5 * unit)
        const probeGround = surfaceUnder(spawnX, spawnZ, probe, PLAYER_RADIUS * unit)
        const spawnFeet = Number.isFinite(probeGround) ? probeGround : bounds.min.y
        walk.spawn.set(spawnX, spawnFeet, spawnZ)
        walk.spawnYaw = 0

        const distance = maxDim * 1.25
        camera.position.set(center.x + distance, center.y + distance * 0.55, center.z + distance * 1.85)
        camera.near = Math.max(maxDim / 2000, 0.001)
        camera.far = Math.max(maxDim * 300, 100)
        orbitNear = camera.near
        orbitFar = camera.far
        camera.updateProjectionMatrix()
        controls.target.copy(center)
        controls.minDistance = Math.max(maxDim * 0.12, 0.1)
        controls.maxDistance = Math.max(maxDim * 6, 10)
        controls.update()
        orbitView.position.copy(camera.position)
        orbitView.target.copy(center)

        if (modeRef.current === 'walk') applyMode('walk')
        setStatus({ phase: 'ready', progress: 100, processing: false, error: '' })
      },
      event => {
        if (!disposed && event.total > 0) {
          const received = Math.round((event.loaded / event.total) * 100)
          setStatus({ phase: 'loading', progress: Math.min(received, 99), processing: received >= 99, error: '' })
        }
      },
      error => {
        if (!disposed) setStatus({ phase: 'error', progress: 0, processing: false, error: 'No se pudo preparar el modelo 3D. Comprueba tu conexión e inténtalo de nuevo.' })
        console.error('No se pudo cargar el modelo 3D:', error)
      },
    )

    const keys = new Set()
    let lookPointerId = null
    let lookX = 0
    let lookY = 0
    let dragPointerId = null
    let dragX = 0
    let dragY = 0
    let dragMoved = false

    const updateWalk = dt => {
      const unit = walk.unit
      const running = keys.has('ShiftLeft') || keys.has('ShiftRight')
      const speed = (running ? RUN_SPEED : WALK_SPEED) * unit
      const forwardInput = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0)
      const strafeInput = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0)
      let moveForward = forwardInput - inputRef.current.joyY
      let moveStrafe = strafeInput + inputRef.current.joyX
      const magnitude = Math.hypot(moveForward, moveStrafe)
      if (magnitude > 0.08) {
        if (magnitude > 1) {
          moveForward /= magnitude
          moveStrafe /= magnitude
        }
        const sin = Math.sin(walk.yaw)
        const cos = Math.cos(walk.yaw)
        const dx = (-sin * moveForward + cos * moveStrafe) * speed * dt
        const dz = (-cos * moveForward - sin * moveStrafe) * speed * dt
        if (dx !== 0 && !blockedAt(walk.pos.x + dx, walk.pos.z, walk.feet)) walk.pos.x += dx
        if (dz !== 0 && !blockedAt(walk.pos.x, walk.pos.z + dz, walk.feet)) walk.pos.z += dz
      }

      const ground = groundHeightAt(walk.pos.x, walk.pos.z, walk.feet)
      if (Number.isFinite(ground)) {
        if (walk.feet <= ground || ground - walk.feet <= STEP_HEIGHT * unit * 1.2) {
          walk.feet = ground
          walk.vy = 0
        } else {
          walk.vy -= GRAVITY * unit * dt
          walk.feet += walk.vy * dt
          if (walk.feet <= ground) {
            walk.feet = ground
            walk.vy = 0
          }
        }
      } else {
        walk.vy -= GRAVITY * unit * dt
        walk.feet += walk.vy * dt
        if (walk.feet <= walk.floorY) {
          walk.feet = walk.floorY
          walk.vy = 0
        }
      }

      camera.position.set(walk.pos.x, walk.feet + EYE_HEIGHT * unit, walk.pos.z)
      camera.rotation.set(walk.pitch, walk.yaw, 0)
      lamp.position.copy(camera.position)
    }

    const clock = new THREE.Clock()
    let lastRenderAt = 0
    const frameInterval = 1000 / (lowPower ? 30 : 60)
    const render = now => {
      animationFrame = 0
      if (disposed) return
      if (now - lastRenderAt < frameInterval) { scheduleRender(); return }
      const dt = Math.min(clock.getDelta(), 0.05)
      let moving
      if (walk.active) {
        updateWalk(dt)
        moving = keys.size > 0 || Math.abs(inputRef.current.joyX) > 0.03 || Math.abs(inputRef.current.joyY) > 0.03 || Math.abs(walk.vy) > 0.02
      } else {
        moving = controls.update() === true
      }
      renderer.render(scene, camera)
      lastRenderAt = now
      if (moving) scheduleRender()
    }
    scheduleRender = () => {
      if (!disposed && !animationFrame) animationFrame = window.requestAnimationFrame(render)
    }

    const onCanvasClick = () => {
      if (dragMoved) {
        dragMoved = false
        return
      }
      requestLock()
    }
    const onPointerLockChange = () => setLocked(document.pointerLockElement === canvas)

    const onKeyDown = event => {
      if (!walk.active) return
      if (event.code === 'Escape') {
        exitWalkRef.current()
        return
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault()
      keys.add(event.code)
      scheduleRender()
    }
    const onKeyUp = event => { keys.delete(event.code); scheduleRender() }
    const onWindowBlur = () => {
      keys.clear()
      inputRef.current.joyX = 0
      inputRef.current.joyY = 0
      scheduleRender()
    }

    const onMouseMove = event => {
      if (!walk.active || document.pointerLockElement !== canvas) return
      walk.yaw -= event.movementX * MOUSE_SENSITIVITY
      walk.pitch = clampPitch(walk.pitch - event.movementY * MOUSE_SENSITIVITY)
      scheduleRender()
    }

    const onCanvasPointerDown = event => {
      if (!walk.active) return
      if (event.pointerType === 'mouse') {
        if (event.button !== 0 || document.pointerLockElement === canvas) return
        dragPointerId = event.pointerId
        dragX = event.clientX
        dragY = event.clientY
        dragMoved = false
        return
      }
      if (lookPointerId !== null) return
      lookPointerId = event.pointerId
      lookX = event.clientX
      lookY = event.clientY
    }

    const onCanvasPointerMove = event => {
      if (!walk.active) return
      if (event.pointerType === 'mouse') {
        if (event.pointerId !== dragPointerId || document.pointerLockElement === canvas) return
        if (Math.abs(event.clientX - dragX) > 3 || Math.abs(event.clientY - dragY) > 3) dragMoved = true
        walk.yaw -= (event.clientX - dragX) * TOUCH_SENSITIVITY
        walk.pitch = clampPitch(walk.pitch - (event.clientY - dragY) * TOUCH_SENSITIVITY)
        scheduleRender()
        dragX = event.clientX
        dragY = event.clientY
        return
      }
      if (event.pointerId !== lookPointerId) return
      walk.yaw -= (event.clientX - lookX) * TOUCH_SENSITIVITY
      walk.pitch = clampPitch(walk.pitch - (event.clientY - lookY) * TOUCH_SENSITIVITY)
      scheduleRender()
      lookX = event.clientX
      lookY = event.clientY
    }

    const endCanvasPointerLook = event => {
      if (event.pointerId === lookPointerId) lookPointerId = null
      if (event.pointerId === dragPointerId) dragPointerId = null
    }

    const resizeObserver = new ResizeObserver(() => {
      const nextWidth = Math.max(mount.clientWidth, 1)
      const nextHeight = Math.max(mount.clientHeight, 1)
      camera.aspect = nextWidth / nextHeight
      camera.updateProjectionMatrix()
      renderer.setSize(nextWidth, nextHeight)
      scheduleRender()
    })
    resizeObserver.observe(mount)

    canvas.addEventListener('click', onCanvasClick)
    canvas.addEventListener('pointerdown', onCanvasPointerDown)
    canvas.addEventListener('pointermove', onCanvasPointerMove)
    canvas.addEventListener('pointerup', endCanvasPointerLook)
    canvas.addEventListener('pointercancel', endCanvasPointerLook)
    document.addEventListener('pointerlockchange', onPointerLockChange)
    document.addEventListener('mousemove', onMouseMove)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onWindowBlur)

    scheduleRender()

    return () => {
      disposed = true
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      canvas.removeEventListener('click', onCanvasClick)
      canvas.removeEventListener('pointerdown', onCanvasPointerDown)
      canvas.removeEventListener('pointermove', onCanvasPointerMove)
      canvas.removeEventListener('pointerup', endCanvasPointerLook)
      canvas.removeEventListener('pointercancel', endCanvasPointerLook)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onWindowBlur)
      if (document.pointerLockElement === canvas) document.exitPointerLock?.()
      apiRef.current = null
      controls.dispose()
      const geometries = new Set()
      const materials = new Set()
      const textures = new Set()
      model?.traverse(object => {
        if (!object.isMesh) return
        if (object.geometry) geometries.add(object.geometry)
        const objectMaterials = Array.isArray(object.material) ? object.material : [object.material]
        objectMaterials.forEach(material => {
          if (!material) return
          materials.add(material)
          Object.values(material).forEach(value => { if (value?.isTexture) textures.add(value) })
        })
      })
      geometries.forEach(geometry => geometry.dispose())
      textures.forEach(texture => texture.dispose())
      materials.forEach(material => material.dispose())
      repeatedInstances.forEach(instance => instance.dispose())
      repeatedInstances = []
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [src, walkable])

  exitWalkRef.current = () => setMode('orbit')

  const handleJoystickMove = event => {
    const base = joystickBaseRef.current
    const knob = joystickKnobRef.current
    if (!base || !knob) return
    const rect = base.getBoundingClientRect()
    const radius = Math.max(rect.width * 0.32, 1)
    let dx = event.clientX - (rect.left + rect.width / 2)
    let dy = event.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(dx, dy)
    if (distance > radius) {
      dx = (dx / distance) * radius
      dy = (dy / distance) * radius
    }
    knob.style.transform = `translate(${dx}px, ${dy}px)`
    inputRef.current.joyX = dx / radius
    inputRef.current.joyY = dy / radius
    apiRef.current?.requestRender?.()
  }

  const handleJoystickDown = event => {
    if (joystickPointerRef.current !== null) return
    joystickPointerRef.current = event.pointerId
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    handleJoystickMove(event)
  }

  const handleJoystickEnd = event => {
    if (event.pointerId !== joystickPointerRef.current) return
    joystickPointerRef.current = null
    inputRef.current.joyX = 0
    inputRef.current.joyY = 0
    apiRef.current?.requestRender?.()
    if (joystickKnobRef.current) joystickKnobRef.current.style.transform = 'translate(0px, 0px)'
  }

  return createPortal(
    <div ref={overlayRef} className={`glb-viewer-overlay${expanded ? ' is-expanded' : ''}`} role="dialog" aria-modal="true" aria-label={`Modelo 3D: ${title}`} onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <section className="glb-viewer-panel">
        <header className="glb-viewer-header">
          <div>
            <span className="glb-viewer-kicker">Modelo interactivo</span>
            <h2>{title}</h2>
          </div>
          <div className="glb-viewer-header-actions">
            {walkable && status.phase === 'ready' && (
              <div className="glb-viewer-modes" role="group" aria-label="Modo de visualización">
                <button type="button" className={mode === 'orbit' ? 'is-active' : ''} onClick={() => setMode('orbit')}>Órbita</button>
                <button type="button" className={mode === 'walk' ? 'is-active' : ''} onClick={() => setMode('walk')}>Recorrer<span className="glb-modes-extra"> interior</span></button>
              </div>
            )}
            <button
              type="button"
              className={`glb-viewer-fullscreen${expanded ? ' is-active' : ''}`}
              onClick={toggleExpanded}
              aria-label={expanded ? 'Salir de pantalla completa' : 'Ver a pantalla completa'}
              aria-pressed={expanded}
              title={expanded ? 'Salir de pantalla completa' : 'Ver a pantalla completa'}
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {expanded
                  ? <path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" />
                  : <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />}
              </svg>
              <span className="glb-fullscreen-label">{expanded ? 'Reducir' : 'Pantalla completa'}</span>
            </button>
            <button className="glb-viewer-close" type="button" onClick={onClose}>Cerrar</button>
          </div>
        </header>
        <div className="glb-viewer-canvas" ref={mountRef}>
          {status.phase !== 'ready' && (
            <div className={`glb-viewer-status${status.phase === 'error' ? ' is-error' : ''}`} role={status.phase === 'error' ? 'alert' : 'status'}>
              {status.phase === 'loading' ? (
                <>
                  <span className="glb-viewer-spinner" />
                  <span>{status.processing ? 'Preparando el modelo para mostrarlo…' : `Descargando el modelo 3D… ${status.progress}%`}</span>
                  {status.processing && <span className="glb-viewer-progress-track" aria-hidden="true"><span /></span>}
                </>
              ) : (
                <>
                  <span>{status.error}</span>
                  <button className="glb-viewer-retry" type="button" onClick={() => window.location.reload()}>Volver a cargar</button>
                </>
              )}
            </div>
          )}
          {status.phase === 'ready' && (
            <button
              type="button"
              className="glb-viewer-help"
              onClick={() => {
                setControlsHintVisible(true)
                window.clearTimeout(hintTimerRef.current)
                hintTimerRef.current = window.setTimeout(() => setControlsHintVisible(false), 7000)
              }}
              aria-label="Mostrar controles"
              aria-expanded={controlsHintVisible}
              title="Mostrar controles"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M9.8 9a2.3 2.3 0 1 1 3.9 1.6c-1 .9-1.7 1.2-1.7 2.4M12 16.4h.01" />
              </svg>
            </button>
          )}
          {status.phase === 'ready' && mode === 'orbit' && (
            <span className={`glb-viewer-hint${controlsHintVisible ? ' is-visible' : ' is-hidden'}`} aria-hidden={!controlsHintVisible}>Arrastra para girar · Pellizca o usa la rueda para acercar</span>
          )}
          {status.phase === 'ready' && mode === 'walk' && (
            <>
              <span className="glb-walk-crosshair" aria-hidden="true" />
              <button type="button" className="glb-walk-reset" onClick={() => apiRef.current?.resetWalk?.()}>Reiniciar</button>
              {coarsePointer ? (
                <>
                  <span className={`glb-walk-hint${controlsHintVisible ? ' is-visible' : ' is-hidden'}`} aria-hidden={!controlsHintVisible}>Mueve con el joystick · arrastra la pantalla para mirar</span>
                  <div
                    className="glb-walk-joystick"
                    ref={joystickBaseRef}
                    role="group"
                    aria-label="Joystick de movimiento"
                    onPointerDown={handleJoystickDown}
                    onPointerMove={event => { if (event.pointerId === joystickPointerRef.current) handleJoystickMove(event) }}
                    onPointerUp={handleJoystickEnd}
                    onPointerCancel={handleJoystickEnd}
                  >
                    <div className="glb-walk-joystick-knob" ref={joystickKnobRef} />
                  </div>
                </>
              ) : (
                <div className={`glb-walk-hint${controlsHintVisible ? ' is-visible' : ' is-hidden'}`} aria-hidden={!controlsHintVisible}>
                  <div className="glb-walk-controls">
                    <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
                    <span>moverte</span>
                    <span className="glb-walk-sep">·</span>
                    <kbd>Mayús</kbd><span>correr</span>
                    <span className="glb-walk-sep">·</span>
                    <span>{locked ? 'Ratón para mirar' : 'Haz clic para capturar el ratón'}</span>
                    <span className="glb-walk-sep">·</span>
                    <span>Esc libera el ratón</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>,
    document.body,
  )
}
