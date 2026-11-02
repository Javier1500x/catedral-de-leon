# Catedral de León — paquete 3D

Esta carpeta contiene la escena actual y el modelo preparado para el visor web.

## Archivos

- `catedral_leon.blend`: copia editable de la escena de Blender, con cámaras, luces, colecciones, materiales y texturas.
- `catedral_leon.glb`: exportación glTF binaria para la web. Incluye la escena actualizada, materiales y texturas; las cámaras y luces de Blender se omiten.
- `banca_de_madera.glb`, `piso_liso.glb`, `marble_altar.glb` y `cupula_ventana.glb`: modelos de origen usados para integrar las bancas, el acabado del pavimento, el altar y la fila interior de cúpulas.

La nave conserva seis cúpulas centrales y seis en cada lateral. Los paños curvos de la bóveda central se completaron entre nervaduras, dejando las seis lucernas visibles. Se recuperó el acabado de estuco envejecido en los muros y se cerró el paño continuo faltante del lado izquierdo.

El mausoleo de Rubén Darío quedó junto al pilar derecho señalado, mirando hacia la entrada. La verja perimetral que estaba en el acceso ahora rodea la tumba. Cuatro bancas se reubicaron al fondo del lado izquierdo para despejar ese tramo; la Guadalupana y el tabernáculo del Sagrado Corazón permanecen libres en sus capillas. El retablo dorado conserva su mesa de altar delante. El GLB está en unidades métricas y usa el eje Y hacia arriba de glTF.

## Ruta para el sitio Vite

Al estar dentro de `public/`, el modelo se sirve en:

```text
/models/catedral-leon/catedral_leon.glb
```

El proyecto ya tiene un visor basado en Three.js y `GLTFLoader`; puede recibir esta ruta como la propiedad `src`.

## Atribución y uso

La tumba de Rubén Darío y el modelo de león de entrada se descargaron de Sketchfab, creados por **miaru3d**, con licencia **CC Attribution-NonCommercial**. Debe darse crédito al autor y el uso de esas piezas está limitado a proyectos no comerciales. El león se reutiliza en ambos lados de la fachada.

La fachada exterior principal se modeló en Blender a partir de las referencias proporcionadas. El modelo de fachada de Sketchfab no se pudo descargar (respuesta 403), así que no forma parte de este paquete.

## Nota de exportación

Las texturas principales de estuco, caliza, madera, pavimento, altar y cúpulas se incluyen para que aparezcan en el GLB. El archivo `.blend` conserva la escena de autoría y sus materiales editables.




