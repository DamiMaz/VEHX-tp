# Modelos 3D de Vehículos con Animación Dimensional para VEHX

Coloca aquí los archivos de modelos 3D exportados en formato **glTF 2.0 Binary (.glb)**:

1. `sedan.glb` - Modelo Sedán (ej. Toyota Corolla 2.0 Dynamic Force / Honda Civic)
2. `suv.glb` - Modelo SUV (ej. Toyota RAV4 Hybrid / Volkswagen Taos)
3. `4x4.glb` - Modelo 4x4 / Pick-up (ej. Ford Ranger Raptor 4x4 / Toyota Hilux GR-Sport)

### Especificaciones técnicas para la generación de los archivos:
- **Formato:** `.glb` (glTF 2.0 Binary con materiales y texturas embebidas).
- **Compresión:** Draco activada (tamaño óptimo < 3MB a 5MB).
- **Animaciones incluidas en el archivo:**
  - Pista de animación en bucle ("loop"): rotación de carrocería (Turntable 360°) o movimiento de suspensión ("Idle") y giro de ruedas en eje local X.
  - Tasa: 30 o 60 FPS.
- **Pivote:** Centrado en [0, 0, 0] sobre la superficie del suelo (ruedas apoyadas en Y = 0).
- **Geometría:** Low-Poly / Mid-Poly (15.000 a 45.000 polígonos/triángulos recomendados para WebGL fluido en teléfonos móviles).
- **Materiales:** Workflow PBR estándar (Albedo/Color, Roughness, Metallic).
