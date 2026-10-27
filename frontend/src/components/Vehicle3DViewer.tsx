import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { BodyType } from '../types/vehicle';
import { RotateCw, Sparkles, Box } from 'lucide-react';

interface Vehicle3DViewerProps {
  model3dPath?: string;
  bodyType?: BodyType;
  modelName?: string;
  className?: string;
  heightClass?: string;
  autoRotateSpeed?: number;
}

export const Vehicle3DViewer: React.FC<Vehicle3DViewerProps> = ({
  model3dPath,
  bodyType = 'sedan',
  modelName,
  className = '',
  heightClass = 'h-52 sm:h-64',
  autoRotateSpeed = 0.008
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCustomModelLoaded, setIsCustomModelLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Escena, Cámara y Renderer
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.2, 2.2, 4.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Luces acordes a la paleta (Amber Autumn #CA9C68, Afternoon Tea #594C3D, Carbon #2B2F2E)
    const ambientLight = new THREE.AmbientLight(0xd5c4a1, 1.4);
    scene.add(ambientLight);

    // Luz principal cálida (simulando atardecer dorado / showroom)
    const mainLight = new THREE.DirectionalLight(0xca9c68, 2.6);
    mainLight.position.set(5, 7, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Luz de relleno fría / neutra
    const fillLight = new THREE.DirectionalLight(0x7c6f64, 1.2);
    fillLight.position.set(-5, 3, -4);
    scene.add(fillLight);

    // Luz de recorte trasera
    const rimLight = new THREE.DirectionalLight(0xfbf1c7, 1.2);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    // Luz cenital suave para reflejo de techo y capó
    const topLight = new THREE.DirectionalLight(0xf2e6d6, 1.4);
    topLight.position.set(0, 8, 0);
    scene.add(topLight);

    // Luz de piso cálida (resalta llantas y pedestal en tono Amber Autumn)
    const underLight = new THREE.PointLight(0xca9c68, 1.8, 6);
    underLight.position.set(0, 0.25, 0);
    scene.add(underLight);

    // 3. Plataforma / Pedestal de Exhibición
    const platformGroup = new THREE.Group();

    // Base circular
    const platformGeo = new THREE.CylinderGeometry(2.5, 2.6, 0.12, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x181d22,
      roughness: 0.6,
      metalness: 0.4
    });
    const platformMesh = new THREE.Mesh(platformGeo, platformMat);
    platformMesh.position.y = -0.06;
    platformMesh.receiveShadow = true;
    platformGroup.add(platformMesh);

    // Anillo exterior brillante color Amber Autumn
    const ringGeo = new THREE.RingGeometry(2.45, 2.55, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xca9c68,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.005;
    platformGroup.add(ringMesh);

    scene.add(platformGroup);

    // 4. Grupo raíz del Vehículo (para rotación global)
    const vehicleRoot = new THREE.Group();
    scene.add(vehicleRoot);

    let mixer: THREE.AnimationMixer | null = null;
    let wheelsList: THREE.Mesh[] = [];

    // 5. Carga de modelo GLB o fallback procedimental según la categoría
    const targetPath = model3dPath || `/models/${bodyType}.glb`;
    const loader = new GLTFLoader();

    let isDisposed = false;

    loader.load(
      targetPath,
      (gltf) => {
        if (isDisposed) return;
        setIsCustomModelLoaded(true);
        setLoadError(null);

        const model = gltf.scene;

        // Auto-centrado y escalado del modelo
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.2 / (maxDim || 1);
        model.scale.setScalar(scale);

        // Alinear al suelo del pedestal
        model.position.x = -center.x * scale;
        model.position.y = -box.min.y * scale;
        model.position.z = -center.z * scale;

        model.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            const mesh = node as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        // Configurar animaciones embebidas en el GLB si existen
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer?.clipAction(clip).play();
          });
        }

        vehicleRoot.add(model);
      },
      undefined,
      () => {
        if (isDisposed) return;
        // Si el archivo .glb aún no ha sido colocado en /public/models/, renderizamos el modelo procedimental
        setIsCustomModelLoaded(false);
        setLoadError(`Modelo .GLB en espera en ${targetPath}`);

        const proceduralModel = buildProceduralVehicle(bodyType);
        vehicleRoot.add(proceduralModel.group);
        wheelsList = proceduralModel.wheels;
      }
    );

    // 6. Construcción del modelo procedural según carrocería (Sedán, SUV, 4x4)
    function buildProceduralVehicle(type: BodyType) {
      const group = new THREE.Group();
      const wheels: THREE.Mesh[] = [];

      // Parámetros dimensionales por carrocería
      const is4x4 = type === '4x4';
      const isSuv = type === 'suv';

      const groundClearance = is4x4 ? 0.38 : isSuv ? 0.28 : 0.18;
      const bodyHeight = is4x4 ? 0.75 : isSuv ? 0.70 : 0.55;
      const cabinHeight = is4x4 ? 0.65 : isSuv ? 0.65 : 0.52;
      const wheelRadius = is4x4 ? 0.36 : isSuv ? 0.30 : 0.26;
      const wheelWidth = is4x4 ? 0.26 : 0.20;

      // Colores de carrocería (estilo River Styx / Carbon oscuro)
      const bodyColor = is4x4 ? 0x22262a : isSuv ? 0x1b232b : 0x181e24;
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: 0.35,
        metalness: 0.75
      });

      const trimMat = new THREE.MeshStandardMaterial({
        color: 0x111315,
        roughness: 0.8,
        metalness: 0.2
      });

      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x0b0f13,
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85
      });

      // Chasis inferior
      const chassisGeo = new THREE.BoxGeometry(1.4, bodyHeight, 3.4);
      const chassis = new THREE.Mesh(chassisGeo, bodyMat);
      chassis.position.y = groundClearance + bodyHeight / 2;
      chassis.castShadow = true;
      group.add(chassis);

      // Cabina
      const cabinLength = is4x4 ? 1.8 : isSuv ? 2.2 : 1.9;
      const cabinOffsetZ = is4x4 ? -0.3 : isSuv ? -0.1 : -0.1;
      const cabinGeo = new THREE.BoxGeometry(1.25, cabinHeight, cabinLength);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.position.set(0, chassis.position.y + bodyHeight / 2 + cabinHeight / 2 - 0.05, cabinOffsetZ);
      cabin.castShadow = true;
      group.add(cabin);

      // Techo de la cabina
      const roofGeo = new THREE.BoxGeometry(1.28, 0.06, cabinLength + 0.05);
      const roof = new THREE.Mesh(roofGeo, bodyMat);
      roof.position.set(0, cabin.position.y + cabinHeight / 2, cabinOffsetZ);
      group.add(roof);

      // Barras de techo si es SUV o 4x4
      if (isSuv || is4x4) {
        const railGeo = new THREE.CylinderGeometry(0.02, 0.02, cabinLength * 0.85, 12);
        const railMat = new THREE.MeshStandardMaterial({ color: 0xca9c68, metalness: 0.8, roughness: 0.3 });

        const railL = new THREE.Mesh(railGeo, railMat);
        railL.rotation.x = Math.PI / 2;
        railL.position.set(-0.55, roof.position.y + 0.06, cabinOffsetZ);
        group.add(railL);

        const railR = railL.clone();
        railR.position.x = 0.55;
        group.add(railR);
      }

      // Si es 4x4, caja trasera tipo Pick-up
      if (is4x4) {
        const bedGeo = new THREE.BoxGeometry(1.35, 0.35, 1.1);
        const bed = new THREE.Mesh(bedGeo, trimMat);
        bed.position.set(0, chassis.position.y + 0.25, -1.1);
        group.add(bed);

        // Barra antivuelco
        const rollbarGeo = new THREE.TorusGeometry(0.55, 0.03, 8, 16, Math.PI);
        const rollbarMat = new THREE.MeshStandardMaterial({ color: 0xca9c68, metalness: 0.9, roughness: 0.2 });
        const rollbar = new THREE.Mesh(rollbarGeo, rollbarMat);
        rollbar.rotation.y = Math.PI / 2;
        rollbar.position.set(0, cabin.position.y + 0.05, -0.6);
        group.add(rollbar);
      }

      // Faros delanteros con brillo cálido Amber
      const headlightMat = new THREE.MeshBasicMaterial({ color: 0xca9c68 });
      const headlightGeo = new THREE.BoxGeometry(0.28, 0.1, 0.05);

      const headlightL = new THREE.Mesh(headlightGeo, headlightMat);
      headlightL.position.set(-0.48, chassis.position.y + 0.1, 1.71);
      group.add(headlightL);

      const headlightR = headlightL.clone();
      headlightR.position.x = 0.48;
      group.add(headlightR);

      // Luces traseras rojas
      const tailMat = new THREE.MeshBasicMaterial({ color: 0xcc241d });
      const tailGeo = new THREE.BoxGeometry(0.28, 0.08, 0.05);
      const tailL = new THREE.Mesh(tailGeo, tailMat);
      tailL.position.set(-0.48, chassis.position.y + 0.1, -1.71);
      group.add(tailL);

      const tailR = tailL.clone();
      tailR.position.x = 0.48;
      group.add(tailR);

      // Ruedas (4)
      const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24);
      const tireMat = new THREE.MeshStandardMaterial({
        color: 0x121416,
        roughness: 0.85,
        metalness: 0.1
      });
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xca9c68,
        metalness: 0.8,
        roughness: 0.3
      });

      const wheelPositions = [
        { x: -0.72, z: 1.1 },
        { x: 0.72, z: 1.1 },
        { x: -0.72, z: -1.1 },
        { x: 0.72, z: -1.1 }
      ];

      wheelPositions.forEach((pos) => {
        const wheelMesh = new THREE.Mesh(wheelGeo, tireMat);
        wheelMesh.rotation.z = Math.PI / 2;
        wheelMesh.position.set(pos.x, wheelRadius, pos.z);
        wheelMesh.castShadow = true;

        // Llanta interior
        const rimMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(wheelRadius * 0.65, wheelRadius * 0.65, wheelWidth + 0.01, 12),
          rimMat
        );
        wheelMesh.add(rimMesh);

        group.add(wheelMesh);
        wheels.push(wheelMesh);
      });

      return { group, wheels };
    }

    // 7. Controles de arrastre manual e interactividad (Orbita alrededor del vehículo)
    let isDragging = false;
    let prevMouseX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      vehicleRoot.rotation.y += deltaX * 0.01;
      platformGroup.rotation.y += deltaX * 0.01;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.style.cursor = 'grab';
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 8. Bucle de animación (60 FPS)
    const clock = new THREE.Clock();
    let animFrameId: number;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Animaciones embebidas de Blender/GLB
      if (mixer) {
        mixer.timeScale = isRotating && !isDragging ? 1.0 : 0.0;
        mixer.update(delta);
      }

      // Rotación suave del vehículo en reposo
      if (isRotating && !isDragging) {
        if (!mixer) {
          vehicleRoot.rotation.y += autoRotateSpeed;
        }
        platformGroup.rotation.y += autoRotateSpeed;
      }

      // Respiración de suspensión y giro de ruedas procedural
      if (wheelsList.length > 0) {
        wheelsList.forEach((w) => {
          w.rotation.x += delta * 4;
        });
        vehicleRoot.position.y = Math.sin(elapsedTime * 2.5) * 0.015;
      }

      camera.lookAt(0, 0.6, 0);
      renderer.render(scene, camera);
    };

    animate();

    // 9. Manejador de redimensionado responsive
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 220;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Limpieza
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, [model3dPath, bodyType, autoRotateSpeed, isRotating]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#1b232b] to-[#13191f] border border-tea/40 shadow-inner select-none ${className}`}>
      {/* Contenedor Canvas WebGL */}
      <div ref={containerRef} className={`w-full ${heightClass}`} />

      {/* Controles y Badges Superpuestos */}
      <div className="absolute top-2.5 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-carbon/90 border border-amber-autumn/50 text-amber-autumn shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-autumn" />
          {bodyType.toUpperCase()} 3D
        </span>
        {modelName && (
          <span className="text-[11px] font-bold text-text-primary px-2 py-0.5 rounded-full bg-river/70 backdrop-blur-sm border border-tea/30">
            {modelName}
          </span>
        )}
      </div>

      {/* Botón de pausa / reanudar rotación y arrastre */}
      <div className="absolute top-2.5 right-3 flex items-center gap-1 z-10">
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Pausar rotación automática' : 'Reanudar rotación 360°'}
          className={`p-1.5 rounded-lg border text-xs transition-all ${
            isRotating
              ? 'bg-amber-autumn text-river border-amber-autumn shadow-amber-glow font-bold'
              : 'bg-carbon/80 text-text-secondary border-tea/50 hover:text-text-primary'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>
      </div>

      {/* Pie informativo sobre el modelo 3D */}
      <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[10px] text-text-secondary/80 pointer-events-none">
        <span className="flex items-center gap-1">
          <Box className="w-3 h-3 text-amber-autumn/80" />
          {isCustomModelLoaded ? (
            <span className="text-emerald-400 font-bold">Modelo GLB cargado ({model3dPath?.split('/').pop()})</span>
          ) : (
            <span>Arrastra para girar • Esperando GLB</span>
          )}
        </span>
        <span className="text-text-secondary font-mono text-[9px] bg-carbon/60 px-1.5 py-0.5 rounded border border-tea/30">
          WebGL • 60 FPS
        </span>
      </div>
    </div>
  );
};
