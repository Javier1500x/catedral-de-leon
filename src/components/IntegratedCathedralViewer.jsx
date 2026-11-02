import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function IntegratedCathedralViewer() {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const animFrameId = useRef(null)
  const materialsRef = useRef([])

  const [wireframe, setWireframe] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const [activePreset, setActivePreset] = useState('general')
  const [showControlsHint, setShowControlsHint] = useState(true)
  const hintTimerRef = useRef(null)

  const revealControlsHint = () => {
    setShowControlsHint(true)
    window.clearTimeout(hintTimerRef.current)
    hintTimerRef.current = window.setTimeout(() => setShowControlsHint(false), 7000)
  }

  useEffect(() => {
    hintTimerRef.current = window.setTimeout(() => setShowControlsHint(false), 7000)
    return () => window.clearTimeout(hintTimerRef.current)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight || 520

    // ── SCENE ──
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b1120)
    scene.fog = new THREE.FogExp2(0x0b1120, 0.012)
    sceneRef.current = scene

    // ── CAMERA ──
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(40, 28, 48)
    cameraRef.current = camera

    // ── RENDERER ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // ── CONTROLS ──
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxPolarAngle = Math.PI / 2 - 0.02
    controls.minDistance = 10
    controls.maxDistance = 120
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.8
    controls.target.set(0, 7, 0)
    controlsRef.current = controls

    // ── LIGHTING ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.0)
    sunLight.position.set(35, 45, 25)
    sunLight.castShadow = true
    sunLight.shadow.mapSize.width = 2048
    sunLight.shadow.mapSize.height = 2048
    sunLight.shadow.camera.near = 1
    sunLight.shadow.camera.far = 120
    sunLight.shadow.camera.left = -35
    sunLight.shadow.camera.right = 35
    sunLight.shadow.camera.top = 35
    sunLight.shadow.camera.bottom = -35
    sunLight.shadow.bias = -0.0005
    scene.add(sunLight)

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.7)
    fillLight.position.set(-30, 20, -30)
    scene.add(fillLight)

    // ── MATERIALS ──
    const stoneColor = 0xe2e8f0
    const domeColor = 0xffffff
    const detailColor = 0x94a3b8

    const matStone = new THREE.MeshStandardMaterial({
      color: stoneColor,
      roughness: 0.85,
      metalness: 0.05,
    })
    const matDome = new THREE.MeshStandardMaterial({
      color: domeColor,
      roughness: 0.45,
      metalness: 0.02,
    })
    const matDetail = new THREE.MeshStandardMaterial({
      color: detailColor,
      roughness: 0.7,
      metalness: 0.1,
    })
    const matBase = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.9,
    })

    materialsRef.current = [matStone, matDome, matDetail, matBase]

    // ── PROCEDURAL CATHEDRAL MODEL ──
    const cathedral = new THREE.Group()

    // 1. Podio / Atrio base
    const baseGeo = new THREE.BoxGeometry(46, 1.2, 70)
    const baseMesh = new THREE.Mesh(baseGeo, matBase)
    baseMesh.position.y = 0.6
    baseMesh.receiveShadow = true
    cathedral.add(baseMesh)

    // Escalones frontales
    for (let i = 0; i < 3; i++) {
      const stepGeo = new THREE.BoxGeometry(32 - i * 2, 0.4, 6 - i * 1.5)
      const stepMesh = new THREE.Mesh(stepGeo, matBase)
      stepMesh.position.set(0, 0.2 + i * 0.4, 35 + i * 0.8)
      stepMesh.receiveShadow = true
      cathedral.add(stepMesh)
    }

    // 2. Nave central (Cuerpo principal de 5 naves)
    const naveCentralGeo = new THREE.BoxGeometry(14, 11, 48)
    const naveCentral = new THREE.Mesh(naveCentralGeo, matStone)
    naveCentral.position.set(0, 6.7, -2)
    naveCentral.castShadow = true
    naveCentral.receiveShadow = true
    cathedral.add(naveCentral)

    // Naves laterales izquierda y derecha (4 naves colaterales)
    const naveLatGeo = new THREE.BoxGeometry(9, 8.5, 48)
    const naveLatIzq = new THREE.Mesh(naveLatGeo, matStone)
    naveLatIzq.position.set(-11.5, 5.45, -2)
    naveLatIzq.castShadow = true
    naveLatIzq.receiveShadow = true
    cathedral.add(naveLatIzq)

    const naveLatDer = new THREE.Mesh(naveLatGeo, matStone)
    naveLatDer.position.set(11.5, 5.45, -2)
    naveLatDer.castShadow = true
    naveLatDer.receiveShadow = true
    cathedral.add(naveLatDer)

    // 3. Transepto / Crucero
    const transeptoGeo = new THREE.BoxGeometry(38, 11.5, 12)
    const transepto = new THREE.Mesh(transeptoGeo, matStone)
    transepto.position.set(0, 6.95, -12)
    transepto.castShadow = true
    transepto.receiveShadow = true
    cathedral.add(transepto)

    // 4. Ábside posterior semicilíndrico
    const absideGeo = new THREE.CylinderGeometry(7, 7, 10.5, 24, 1, false, 0, Math.PI)
    const abside = new THREE.Mesh(absideGeo, matStone)
    abside.position.set(0, 6.45, -26)
    abside.rotation.y = Math.PI / 2
    abside.castShadow = true
    abside.receiveShadow = true
    cathedral.add(abside)

    // 5. Cúpula principal del crucero con linterna
    const granCupulaGeo = new THREE.SphereGeometry(6.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    const granCupula = new THREE.Mesh(granCupulaGeo, matDome)
    granCupula.position.set(0, 12.7, -12)
    granCupula.castShadow = true
    cathedral.add(granCupula)

    const linternaGeo = new THREE.CylinderGeometry(1.4, 1.4, 3.2, 16)
    const linterna = new THREE.Mesh(linternaGeo, matDetail)
    linterna.position.set(0, 19.5, -12)
    cathedral.add(linterna)

    const linternaCupulaGeo = new THREE.SphereGeometry(1.45, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2)
    const linternaCupula = new THREE.Mesh(linternaCupulaGeo, matDome)
    linternaCupula.position.set(0, 21.1, -12)
    cathedral.add(linternaCupula)

    // Cruz de la gran cúpula
    const cruzVert = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.4, 0.2), matDetail)
    cruzVert.position.set(0, 23.2, -12)
    const cruzHoriz = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.2), matDetail)
    cruzHoriz.position.set(0, 23.4, -12)
    cathedral.add(cruzVert)
    cathedral.add(cruzHoriz)

    // 6. Las 34 Cúpulas Blancas sobre la techumbre (distribuidas en cuadrícula)
    const cupulaGeo = new THREE.SphereGeometry(1.7, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2)
    const navePositionsX = [-12, -7, 0, 7, 12]
    const navePositionsZ = [16, 10, 4, -2, -8, -18, -23]

    let domeCount = 0
    navePositionsX.forEach((x) => {
      navePositionsZ.forEach((z) => {
        // Excluir la zona del crucero donde está la gran cúpula
        if (Math.abs(x) < 5 && Math.abs(z - (-12)) < 5) return
        if (domeCount >= 34) return

        const yPos = Math.abs(x) === 0 ? 12.2 : Math.abs(x) === 7 ? 11.2 : 9.7
        const dome = new THREE.Mesh(cupulaGeo, matDome)
        dome.position.set(x, yPos, z)
        dome.castShadow = true
        cathedral.add(dome)

        // Pequeño pináculo / linternilla sobre cada cúpula
        const pinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 8)
        const pin = new THREE.Mesh(pinGeo, matDetail)
        pin.position.set(x, yPos + 1.8, z)
        cathedral.add(pin)

        domeCount++
      })
    })

    // 7. Fachada Principal
    const fachadaGeo = new THREE.BoxGeometry(34, 15, 3.5)
    const fachada = new THREE.Mesh(fachadaGeo, matStone)
    fachada.position.set(0, 8.7, 22)
    fachada.castShadow = true
    fachada.receiveShadow = true
    cathedral.add(fachada)

    // Frontispicio / Frontón central triangular
    const frontonShape = new THREE.Shape()
    frontonShape.moveTo(-8, 0)
    frontonShape.lineTo(8, 0)
    frontonShape.lineTo(0, 4.5)
    frontonShape.closePath()
    const frontonGeo = new THREE.ExtrudeGeometry(frontonShape, { depth: 3.5, bevelEnabled: false })
    const fronton = new THREE.Mesh(frontonGeo, matStone)
    fronton.position.set(0, 16.2, 20.25)
    cathedral.add(fronton)

    // Puerta principal con arco de medio punto
    const puertaGeo = new THREE.BoxGeometry(4.2, 7.5, 0.8)
    const puertaMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
    const puerta = new THREE.Mesh(puertaGeo, puertaMat)
    puerta.position.set(0, 4.95, 23.8)
    cathedral.add(puerta)

    // Puertas laterales
    const pLatGeo = new THREE.BoxGeometry(2.8, 5.5, 0.8)
    const puertaLatIzq = new THREE.Mesh(pLatGeo, puertaMat)
    puertaLatIzq.position.set(-8.5, 3.95, 23.8)
    const puertaLatDer = new THREE.Mesh(pLatGeo, puertaMat)
    puertaLatDer.position.set(8.5, 3.95, 23.8)
    cathedral.add(puertaLatIzq)
    cathedral.add(puertaLatDer)

    // 8. Dos Torres Campanario Cuadrangulares (38m escala)
    const torreX = [-14.5, 14.5]
    torreX.forEach((tx) => {
      // Cuerpo 1 de la torre
      const t1 = new THREE.Mesh(new THREE.BoxGeometry(6.2, 16, 6.2), matStone)
      t1.position.set(tx, 9.2, 22)
      t1.castShadow = true
      cathedral.add(t1)

      // Cornisa de separación
      const cornisa = new THREE.Mesh(new THREE.BoxGeometry(7, 0.8, 7), matDetail)
      cornisa.position.set(tx, 17.6, 22)
      cathedral.add(cornisa)

      // Cuerpo 2 (Campanario con vanos de medio punto)
      const t2 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 7.5, 5.2), matStone)
      t2.position.set(tx, 21.75, 22)
      t2.castShadow = true
      cathedral.add(t2)

      // Cúpula superior de la torre
      const tc = new THREE.Mesh(new THREE.SphereGeometry(2.7, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), matDome)
      tc.position.set(tx, 25.5, 22)
      tc.castShadow = true
      cathedral.add(tc)

      // Linterna y remate de la torre
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.2, 8), matDetail)
      tr.position.set(tx, 28.5, 22)
      cathedral.add(tr)
    })

    scene.add(cathedral)

    // ── SUELO CON MALLA ARQUITECTÓNICA ──
    const gridHelper = new THREE.GridHelper(120, 40, 0x3b82f6, 0x1e293b)
    gridHelper.position.y = 0.02
    scene.add(gridHelper)

    // ── ANIMATION LOOP ──
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // ── RESIZE HANDLER ──
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight || 520
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animFrameId.current)
      controls.dispose()
      renderer.dispose()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Toggle wireframe
  const toggleWireframe = () => {
    const next = !wireframe
    setWireframe(next)
    materialsRef.current.forEach((m) => {
      m.wireframe = next
    })
  }

  // Toggle auto rotate
  const toggleRotate = () => {
    const next = !autoRotate
    setAutoRotate(next)
    if (controlsRef.current) {
      controlsRef.current.autoRotate = next
    }
  }

  // Camera presets
  const applyPreset = (preset) => {
    setActivePreset(preset)
    const camera = cameraRef.current
    const controls = controlsRef.current
    if (!camera || !controls) return

    controls.autoRotate = false
    setAutoRotate(false)

    if (preset === 'general') {
      camera.position.set(40, 28, 48)
      controls.target.set(0, 7, 0)
    } else if (preset === 'fachada') {
      camera.position.set(0, 16, 52)
      controls.target.set(0, 12, 20)
    } else if (preset === 'cupulas') {
      camera.position.set(15, 36, -5)
      controls.target.set(0, 12, -8)
    } else if (preset === 'planta') {
      camera.position.set(0, 68, 0.1)
      controls.target.set(0, 5, 0)
    }
    controls.update()
  }

  return (
    <div className="viewer-3d-container relative">
      {/* Canvas container */}
      <div ref={containerRef} className="viewer-3d-canvas-wrap cursor-grab active:cursor-grabbing" />

      {/* Badge de estado e instrucciones */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-white text-xs font-sans">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">Modelo 3D Interactivo en Tiempo Real</span>
        </div>
        <span className={`viewer-3d-hint${showControlsHint ? ' is-visible' : ' is-hidden'}`} aria-hidden={!showControlsHint}>
          Arrastra con el cursor o el dedo · Pellizca o usa la rueda para acercar
        </span>
      </div>
      <button
        type="button"
        className="viewer-3d-help"
        onClick={revealControlsHint}
        aria-label="Mostrar controles del modelo"
        aria-expanded={showControlsHint}
        title="Mostrar controles"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.8 9a2.3 2.3 0 1 1 3.9 1.6c-1 .9-1.7 1.2-1.7 2.4M12 16.4h.01" />
        </svg>
      </button>

      {/* Toolbar interactiva flotante */}
      <div className="viewer-3d-toolbar">
        {/* Presets de vista */}
        <button
          onClick={() => applyPreset('general')}
          className={`viewer-3d-btn ${activePreset === 'general' ? 'active' : ''}`}
        >
          General
        </button>
        <button
          onClick={() => applyPreset('fachada')}
          className={`viewer-3d-btn ${activePreset === 'fachada' ? 'active' : ''}`}
        >
          Fachada
        </button>
        <button
          onClick={() => applyPreset('cupulas')}
          className={`viewer-3d-btn ${activePreset === 'cupulas' ? 'active' : ''}`}
        >
          34 Cúpulas
        </button>
        <button
          onClick={() => applyPreset('planta')}
          className={`viewer-3d-btn ${activePreset === 'planta' ? 'active' : ''}`}
        >
          Planta
        </button>

        <span className="w-px h-4 bg-slate-700 mx-1" />

        {/* Toggles */}
        <button
          onClick={toggleRotate}
          className={`viewer-3d-btn ${autoRotate ? 'active' : ''}`}
          title="Activar/Desactivar giro automático"
        > {autoRotate ? 'Giro ON' : 'Giro OFF'}
        </button>

        <button
          onClick={toggleWireframe}
          className={`viewer-3d-btn ${wireframe ? 'active' : ''}`}
          title="Alternar modo alambre / cantería"
        > {wireframe ? 'Alambre' : 'Sólido'}
        </button>
      </div>

      {/* Dimensiones arquitectónicas pie */}
      <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/70 backdrop-blur-md border border-slate-700/50 text-slate-300 text-xs font-mono">
        <span>113m × 51m</span>
        <span className="text-slate-600">|</span>
        <span>Torres: 38m</span>
        <span className="text-slate-600">|</span>
        <span>34 Cúpulas</span>
      </div>
    </div>
  )
}

