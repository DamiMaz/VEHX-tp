export interface CatalogServiceItem {
  id: string;
  category: string;
  name: string;
  defaultIntervalKm: number;
  defaultIntervalDays: number;
  defaultCost: number;
  description: string;
}

export interface ServiceCategoryGroup {
  category: string;
  iconName: string;
  services: CatalogServiceItem[];
}

export const SERVICE_CATEGORIES: ServiceCategoryGroup[] = [
  {
    category: 'Motor y lubricación',
    iconName: 'Wrench',
    services: [
      {
        id: 'cat-mot-01',
        category: 'Motor y lubricación',
        name: 'Cambio de aceite de motor',
        defaultIntervalKm: 10000,
        defaultIntervalDays: 365,
        defaultCost: 85000,
        description: 'Aceite sintético o semisintético según especificación del fabricante (API/ACEA).'
      },
      {
        id: 'cat-mot-02',
        category: 'Motor y lubricación',
        name: 'Cambio de filtro de aceite',
        defaultIntervalKm: 10000,
        defaultIntervalDays: 365,
        defaultCost: 25000,
        description: 'Reemplazo del cartucho o blindado filtrante para retener impurezas y lodo de combustión.'
      },
      {
        id: 'cat-mot-03',
        category: 'Motor y lubricación',
        name: 'Cambio de filtro de aire del motor',
        defaultIntervalKm: 15000,
        defaultIntervalDays: 365,
        defaultCost: 32000,
        description: 'Mantiene limpio el caudalímetro y la mezcla estequiométrica, optimizando el consumo.'
      },
      {
        id: 'cat-mot-04',
        category: 'Motor y lubricación',
        name: 'Cambio de filtro de combustible',
        defaultIntervalKm: 20000,
        defaultIntervalDays: 365,
        defaultCost: 45000,
        description: 'Protege la rampa de inyección y los inyectores de sedimentos y agua en el tanque.'
      },
      {
        id: 'cat-mot-05',
        category: 'Motor y lubricación',
        name: 'Cambio de bujías de encendido',
        defaultIntervalKm: 30000,
        defaultIntervalDays: 730,
        defaultCost: 65000,
        description: 'Juego de bujías (níquel, platino o iridio) para una chispa uniforme sin tirones.'
      },
      {
        id: 'cat-mot-06',
        category: 'Motor y lubricación',
        name: 'Cambio de bujías de precalentamiento (calentadores)',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 95000,
        description: 'Específico para motores Diésel, garantiza un arranque en frío suave sin humo blanco.'
      },
      {
        id: 'cat-mot-07',
        category: 'Motor y lubricación',
        name: 'Cambio de cables de bujías y bobinas de encendido',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 110000,
        description: 'Evita pérdidas de alta tensión, fallas de cilindro (misfires) y deterioro del catalizador.'
      },
      {
        id: 'cat-mot-08',
        category: 'Motor y lubricación',
        name: 'Cambio de kit de distribución (correa o cadena, tensores y rodillos)',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1460,
        defaultCost: 285000,
        description: 'Sincronización milimétrica del árbol de levas con el cigüeñal; previene roturas críticas del motor.'
      },
      {
        id: 'cat-mot-09',
        category: 'Motor y lubricación',
        name: 'Cambio de correa de accesorios (Poly-V) y poleas',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 90000,
        description: 'Impulsa el alternador, bomba de dirección y compresor de aire acondicionado.'
      },
      {
        id: 'cat-mot-10',
        category: 'Motor y lubricación',
        name: 'Limpieza y calibración de inyectores',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 75000,
        description: 'Limpieza por ultrasonido y verificación del patrón de pulverización y caudal en banco.'
      },
      {
        id: 'cat-mot-11',
        category: 'Motor y lubricación',
        name: 'Limpieza del cuerpo de aceleración (mariposa)',
        defaultIntervalKm: 30000,
        defaultIntervalDays: 730,
        defaultCost: 45000,
        description: 'Remoción de carbonilla para restablecer un ralentí suave y respuesta inmediata al pedal.'
      },
      {
        id: 'cat-mot-12',
        category: 'Motor y lubricación',
        name: 'Limpieza o reemplazo de la válvula PCV',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 40000,
        description: 'Ventilación positiva de los gases del cárter; evita acumulación de presión y fugas de aceite.'
      },
      {
        id: 'cat-mot-13',
        category: 'Motor y lubricación',
        name: 'Limpieza de la válvula EGR',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 65000,
        description: 'Descarbonización del circuito de recirculación de gases de escape.'
      },
      {
        id: 'cat-mot-14',
        category: 'Motor y lubricación',
        name: 'Regulación de luz de válvulas',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 80000,
        description: 'Calibración mecánica de holgura en admisión y escape para un sellado óptimo.'
      },
      {
        id: 'cat-mot-15',
        category: 'Motor y lubricación',
        name: 'Reemplazo de juntas y retenes (tapa válvulas, cárter, cigüeñal)',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 120000,
        description: 'Saneamiento hermético ante transpiraciones o fugas de aceite de motor.'
      },
      {
        id: 'cat-mot-16',
        category: 'Motor y lubricación',
        name: 'Reemplazo de soportes (tacos) de motor',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 140000,
        description: 'Tacos elásticos antivibratorios de goma y metal que fijan el bloque motor al subchasis.'
      },
      {
        id: 'cat-mot-17',
        category: 'Motor y lubricación',
        name: 'Limpieza interna de motor (flushing)',
        defaultIntervalKm: 30000,
        defaultIntervalDays: 730,
        defaultCost: 50000,
        description: 'Lavado químico de lodos y barnices del circuito de lubricación previo al cambio de aceite.'
      },
      {
        id: 'cat-mot-18',
        category: 'Motor y lubricación',
        name: 'Mantenimiento y limpieza del turbocompresor',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 190000,
        description: 'Inspección de holgura axial/radial de la turbina, geometría variable y conductos de engrase.'
      }
    ]
  },
  {
    category: 'Sistema de refrigeración',
    iconName: 'Droplet',
    services: [
      {
        id: 'cat-ref-01',
        category: 'Sistema de refrigeración',
        name: 'Cambio y purgado de líquido refrigerante / anticongelante',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 55000,
        description: 'Refrigerante orgánico de larga duración (OAT); protege contra corrosión y cavitación.'
      },
      {
        id: 'cat-ref-02',
        category: 'Sistema de refrigeración',
        name: 'Limpieza de radiador y circuito de refrigeración',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 65000,
        description: 'Desincrustación química de sarro y lavado a contracorriente de las galerías.'
      },
      {
        id: 'cat-ref-03',
        category: 'Sistema de refrigeración',
        name: 'Reemplazo de bomba de agua',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1460,
        defaultCost: 130000,
        description: 'Previene fugas por el retén o gripado del rulemán impulsor de caudal.'
      },
      {
        id: 'cat-ref-04',
        category: 'Sistema de refrigeración',
        name: 'Reemplazo de termostato',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 50000,
        description: 'Regula la temperatura de régimen constante (88°C - 95°C) para evitar sobrecalentamiento.'
      },
      {
        id: 'cat-ref-05',
        category: 'Sistema de refrigeración',
        name: 'Reemplazo de mangueras y abrazaderas del sistema de refrigeración',
        defaultIntervalKm: 70000,
        defaultIntervalDays: 1460,
        defaultCost: 60000,
        description: 'Mangueras de caucho EPDM reforzadas para soportar presión y dilatación térmica.'
      },
      {
        id: 'cat-ref-06',
        category: 'Sistema de refrigeración',
        name: 'Reemplazo de tapa de radiador o del depósito de expansión',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 1095,
        defaultCost: 35000,
        description: 'Mantiene la válvula de alivio calibrada a la presión de trabajo requerida (1.1 - 1.4 bar).'
      },
      {
        id: 'cat-ref-07',
        category: 'Sistema de refrigeración',
        name: 'Revisión y cambio de electroventilador o polea viscosa',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 120000,
        description: 'Control de velocidades 1 y 2, resistencia de balastro y acople del motor eléctrico.'
      },
      {
        id: 'cat-ref-08',
        category: 'Sistema de refrigeración',
        name: 'Limpieza o reemplazo del radiador de calefacción',
        defaultIntervalKm: 90000,
        defaultIntervalDays: 1825,
        defaultCost: 140000,
        description: 'Recupera el caudal de aire caliente al habitáculo y previene empañamiento de vidrios.'
      }
    ]
  },
  {
    category: 'Transmisión y tren motriz',
    iconName: 'Settings',
    services: [
      {
        id: 'cat-trn-01',
        category: 'Transmisión y tren motriz',
        name: 'Cambio de aceite de caja de cambios manual',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 65000,
        description: 'Lubricante sintético para engranajes y sincronizados (75W-80 / 75W-90 GL-4).'
      },
      {
        id: 'cat-trn-02',
        category: 'Transmisión y tren motriz',
        name: 'Cambio de fluido de transmisión automática (ATF) y filtro',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 160000,
        description: 'Diálisis o vaciado con fluido ATF original, cambio de junta y filtro de cárter de caja.'
      },
      {
        id: 'cat-trn-03',
        category: 'Transmisión y tren motriz',
        name: 'Cambio de kit de embrague (placa, disco y rulemán de empuje)',
        defaultIntervalKm: 100000,
        defaultIntervalDays: 1825,
        defaultCost: 320000,
        description: 'Recupera la transferencia de torque sin patinamientos ni vibraciones al arrancar.'
      },
      {
        id: 'cat-trn-04',
        category: 'Transmisión y tren motriz',
        name: 'Purgado y cambio de líquido de embrague hidráulico',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 40000,
        description: 'Renovación de fluido DOT4 en el circuito de accionamiento del pedal de embrague.'
      },
      {
        id: 'cat-trn-05',
        category: 'Transmisión y tren motriz',
        name: 'Reemplazo de bomba y bombín de embrague',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 95000,
        description: 'Cilindros maestro y esclavo; eliminan pedal blando o dificultad para engranar marchas.'
      },
      {
        id: 'cat-trn-06',
        category: 'Transmisión y tren motriz',
        name: 'Cambio de aceite de diferencial',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 60000,
        description: 'Aceite hipoidal de alta presión para corona y piñón (GL-5 / LSD).'
      },
      {
        id: 'cat-trn-07',
        category: 'Transmisión y tren motriz',
        name: 'Cambio de aceite de caja de transferencia (reductora)',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 70000,
        description: 'Específico para camionetas y vehículos 4x4 / Tracción integral.'
      },
      {
        id: 'cat-trn-08',
        category: 'Transmisión y tren motriz',
        name: 'Reemplazo de fuelles de semiejes (guardapolvos)',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 55000,
        description: 'Protege las homocinéticas del ingreso de tierra, agua y pérdida de grasa grafitada.'
      },
      {
        id: 'cat-trn-09',
        category: 'Transmisión y tren motriz',
        name: 'Engrase y reemplazo de juntas homocinéticas y tricetas',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 110000,
        description: 'Elimina chasquidos o ruidos al doblar con tracción aplicada.'
      },
      {
        id: 'cat-trn-10',
        category: 'Transmisión y tren motriz',
        name: 'Balanceo de cardán y reemplazo de crucetas',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 95000,
        description: 'Elimina zumbidos y vibraciones de transmisión a media y alta velocidad.'
      },
      {
        id: 'cat-trn-11',
        category: 'Transmisión y tren motriz',
        name: 'Reemplazo de soportes (tacos) de caja de cambios',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 85000,
        description: 'Alineación de la selectora y aislamiento de sacudidas de transmisión.'
      }
    ]
  },
  {
    category: 'Sistema de frenos',
    iconName: 'Disc',
    services: [
      {
        id: 'cat-frn-01',
        category: 'Sistema de frenos',
        name: 'Cambio de pastillas de freno',
        defaultIntervalKm: 25000,
        defaultIntervalDays: 730,
        defaultCost: 75000,
        description: 'Pastillas semimetálicas o cerámicas con testigo acústico/eléctrico de desgaste.'
      },
      {
        id: 'cat-frn-02',
        category: 'Sistema de frenos',
        name: 'Cambio o rectificación de discos de freno',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 1095,
        defaultCost: 110000,
        description: 'Elimina alabeos, vibraciones en el pedal al frenar y asegura espesor mínimo de seguridad.'
      },
      {
        id: 'cat-frn-03',
        category: 'Sistema de frenos',
        name: 'Cambio de cintas (zapatas) de freno',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 65000,
        description: 'Para vehículos con tambores traseros; restablece la fuerza de retención.'
      },
      {
        id: 'cat-frn-04',
        category: 'Sistema de frenos',
        name: 'Cambio o rectificación de campanas (tambores) de freno',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 80000,
        description: 'Rectificación concéntrica para un frenado parejo sin bloqueo prematuro.'
      },
      {
        id: 'cat-frn-05',
        category: 'Sistema de frenos',
        name: 'Cambio y purgado de líquido de frenos',
        defaultIntervalKm: 30000,
        defaultIntervalDays: 730,
        defaultCost: 45000,
        description: 'Líquido DOT 4 o DOT 5.1 higroscópico; previene burbujas de vapor por ebullición.'
      },
      {
        id: 'cat-frn-06',
        category: 'Sistema de frenos',
        name: 'Regulación y cambio de cable de freno de mano (estacionamiento)',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 40000,
        description: 'Ajuste de tensión mecánica o calibración de servomotor de freno electrónico (EPB).'
      },
      {
        id: 'cat-frn-07',
        category: 'Sistema de frenos',
        name: 'Reemplazo de flexibles (mangueras) y cañerías de freno',
        defaultIntervalKm: 70000,
        defaultIntervalDays: 1460,
        defaultCost: 55000,
        description: 'Evita dilataciones blandas del flexible bajo frenadas de pánico.'
      },
      {
        id: 'cat-frn-08',
        category: 'Sistema de frenos',
        name: 'Reparación o cambio de cilindros de rueda y mordazas (calipers)',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 130000,
        description: 'Cambio de guardapolvos de pistón y pasadores flotantes engrasados con silicona.'
      },
      {
        id: 'cat-frn-09',
        category: 'Sistema de frenos',
        name: 'Reemplazo de bomba de freno',
        defaultIntervalKm: 90000,
        defaultIntervalDays: 1825,
        defaultCost: 120000,
        description: 'Cilindro maestro en tándem de doble circuito cruzado de seguridad.'
      },
      {
        id: 'cat-frn-10',
        category: 'Sistema de frenos',
        name: 'Revisión y reemplazo de servofreno',
        defaultIntervalKm: 100000,
        defaultIntervalDays: 1825,
        defaultCost: 160000,
        description: 'Asistencia por vacío del pedal; evita pedal duro al pisar.'
      },
      {
        id: 'cat-frn-11',
        category: 'Sistema de frenos',
        name: 'Limpieza y calibración de sensores de ABS',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 45000,
        description: 'Limpieza de limaduras metálicas en la rueda fónica de cada maza.'
      }
    ]
  },
  {
    category: 'Suspensión y dirección',
    iconName: 'Compass',
    services: [
      {
        id: 'cat-sus-01',
        category: 'Suspensión y dirección',
        name: 'Alineación de dirección',
        defaultIntervalKm: 10000,
        defaultIntervalDays: 180,
        defaultCost: 25000,
        description: 'Regulación de convergencia/divergencia, comba y caster computarizado en 3D.'
      },
      {
        id: 'cat-sus-02',
        category: 'Suspensión y dirección',
        name: 'Balanceo de ruedas',
        defaultIntervalKm: 10000,
        defaultIntervalDays: 180,
        defaultCost: 20000,
        description: 'Compensación con contrapesos plomados para evitar vibraciones al volante.'
      },
      {
        id: 'cat-sus-03',
        category: 'Suspensión y dirección',
        name: 'Rotación de neumáticos',
        defaultIntervalKm: 10000,
        defaultIntervalDays: 180,
        defaultCost: 15000,
        description: 'Rotación cruzada o paralela para emparejar el desgaste de la banda de rodadura.'
      },
      {
        id: 'cat-sus-04',
        category: 'Suspensión y dirección',
        name: 'Cambio de neumáticos',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 1460,
        defaultCost: 450000,
        description: 'Juego de cubiertas nuevas con verificación de índice de carga y velocidad.'
      },
      {
        id: 'cat-sus-05',
        category: 'Suspensión y dirección',
        name: 'Cambio de amortiguadores y cazoletas',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 240000,
        description: 'Amortiguadores presurizados a gas para agarre en curvas y frenada estable.'
      },
      {
        id: 'cat-sus-06',
        category: 'Suspensión y dirección',
        name: 'Cambio de espirales (resortes) o elásticos (ballestas)',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 160000,
        description: 'Recupera la altura original de despeje del vehículo del suelo.'
      },
      {
        id: 'cat-sus-07',
        category: 'Suspensión y dirección',
        name: 'Cambio de parrillas (brazos) de suspensión',
        defaultIntervalKm: 70000,
        defaultIntervalDays: 1460,
        defaultCost: 130000,
        description: 'Conjunto con bujes y rótulas prensadas de alta resistencia.'
      },
      {
        id: 'cat-sus-08',
        category: 'Suspensión y dirección',
        name: 'Cambio de rótulas de suspensión',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 65000,
        description: 'Punto de articulación pivotante de rueda; elimina ruidos secos en empedrados.'
      },
      {
        id: 'cat-sus-09',
        category: 'Suspensión y dirección',
        name: 'Cambio de bujes de tren delantero y trasero',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 80000,
        description: 'Bujes de goma vulcanizada o poliuretano para aislar holguras.'
      },
      {
        id: 'cat-sus-10',
        category: 'Suspensión y dirección',
        name: 'Cambio de bieletas y bujes de barra estabilizadora',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 50000,
        description: 'Minimiza la inclinación de la carrocería en curvas pronunciadas.'
      },
      {
        id: 'cat-sus-11',
        category: 'Suspensión y dirección',
        name: 'Cambio de extremos y precaps (axiales) de dirección',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 70000,
        description: 'Transmite el giro de la cremallera a las maza sin juego en el volante.'
      },
      {
        id: 'cat-sus-12',
        category: 'Suspensión y dirección',
        name: 'Cambio de líquido de dirección hidráulica',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 40000,
        description: 'Fluido ATF/Power Steering para proteger la bomba de paletas.'
      },
      {
        id: 'cat-sus-13',
        category: 'Suspensión y dirección',
        name: 'Reparación o reemplazo de caja / cremallera de dirección',
        defaultIntervalKm: 100000,
        defaultIntervalDays: 1825,
        defaultCost: 290000,
        description: 'Cremallera hidráulica, electrohidráulica o de asistencia eléctrica (EPS).'
      },
      {
        id: 'cat-sus-14',
        category: 'Suspensión y dirección',
        name: 'Cambio de fuelles de cremallera de dirección',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 45000,
        description: 'Sellado hermético de los axiales contra polvo y agua.'
      },
      {
        id: 'cat-sus-15',
        category: 'Suspensión y dirección',
        name: 'Cambio o engrase de rodamientos (rulemanes) de maza de rueda',
        defaultIntervalKm: 70000,
        defaultIntervalDays: 1095,
        defaultCost: 85000,
        description: 'Elimina el zumbido constante que se incrementa con la velocidad.'
      }
    ]
  },
  {
    category: 'Sistema eléctrico y electrónico',
    iconName: 'Zap',
    services: [
      {
        id: 'cat-elec-01',
        category: 'Sistema eléctrico y electrónico',
        name: 'Diagnóstico computarizado (escaneo de módulos y borrado de fallas)',
        defaultIntervalKm: 15000,
        defaultIntervalDays: 180,
        defaultCost: 35000,
        description: 'Lectura OBD-II de códigos DTC en ECU, ABS, Airbag, BCM y transmisión.'
      },
      {
        id: 'cat-elec-02',
        category: 'Sistema eléctrico y electrónico',
        name: 'Control y reemplazo de batería',
        defaultIntervalKm: 45000,
        defaultIntervalDays: 730,
        defaultCost: 140000,
        description: 'Prueba de CCA (corriente de arranque en frío) y reemplazo de batería de 12V / EFB / AGM.'
      },
      {
        id: 'cat-elec-03',
        category: 'Sistema eléctrico y electrónico',
        name: 'Limpieza y sulfatado de bornes de batería',
        defaultIntervalKm: 15000,
        defaultIntervalDays: 180,
        defaultCost: 15000,
        description: 'Desulfatado con grasa grafitada o vaselina para una conducción eléctrica limpia.'
      },
      {
        id: 'cat-elec-04',
        category: 'Sistema eléctrico y electrónico',
        name: 'Mantenimiento y reparación de alternador',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 110000,
        description: 'Revisión de placa de diodos, carbones, regulador de voltaje (13.8V - 14.4V) y rulemanes.'
      },
      {
        id: 'cat-elec-05',
        category: 'Sistema eléctrico y electrónico',
        name: 'Mantenimiento y reparación de motor de arranque (burro)',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 105000,
        description: 'Cambio de carbones, automático (solenoide), bendix impulsor y bujes.'
      },
      {
        id: 'cat-elec-06',
        category: 'Sistema eléctrico y electrónico',
        name: 'Reemplazo de lámparas, focos y módulos LED',
        defaultIntervalKm: 30000,
        defaultIntervalDays: 730,
        defaultCost: 30000,
        description: 'Ópticas principales, luces de stop, posición, marcha atrás y antiniebla.'
      },
      {
        id: 'cat-elec-07',
        category: 'Sistema eléctrico y electrónico',
        name: 'Alineación y regulación de faros delanteros',
        defaultIntervalKm: 20000,
        defaultIntervalDays: 365,
        defaultCost: 20000,
        description: 'Reguloscopio para no encandilar y maximizar la visibilidad nocturna.'
      },
      {
        id: 'cat-elec-08',
        category: 'Sistema eléctrico y electrónico',
        name: 'Revisión y reemplazo de fusibles y relés (relays)',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 25000,
        description: 'Chequeo de fusilera de vano motor y bajo torpedo.'
      },
      {
        id: 'cat-elec-09',
        category: 'Sistema eléctrico y electrónico',
        name: 'Limpieza y reemplazo de sensores (Sonda Lambda, MAF, MAP, CKP, CMP)',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 85000,
        description: 'Sensores de gestión electrónica de inyección y posición de motor.'
      },
      {
        id: 'cat-elec-10',
        category: 'Sistema eléctrico y electrónico',
        name: 'Actualización y reprogramación de software de módulos (ECU)',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 90000,
        description: 'Flasheo de calibración oficial de fábrica para optimizar arranque y consumos.'
      }
    ]
  },
  {
    category: 'Climatización y habitáculo',
    iconName: 'Wind',
    services: [
      {
        id: 'cat-clim-01',
        category: 'Climatización y habitáculo',
        name: 'Cambio de filtro de habitáculo (antipolen / cabina)',
        defaultIntervalKm: 15000,
        defaultIntervalDays: 365,
        defaultCost: 25000,
        description: 'Filtro con carbón activado que retiene polen, ácaros y olores del exterior.'
      },
      {
        id: 'cat-clim-02',
        category: 'Climatización y habitáculo',
        name: 'Carga de gas refrigerante y aceite del compresor (A/C)',
        defaultIntervalKm: 30000,
        defaultIntervalDays: 730,
        defaultCost: 65000,
        description: 'Carga por peso (gramos de R134a o R1234yf) con aceite PAG para lubricación del compresor.'
      },
      {
        id: 'cat-clim-03',
        category: 'Climatización y habitáculo',
        name: 'Detección de fugas y prueba de vacío del sistema A/C',
        defaultIntervalKm: 30000,
        defaultIntervalDays: 730,
        defaultCost: 45000,
        description: 'Prueba de estanqueidad con nitrógeno y tinte ultravioleta (UV).'
      },
      {
        id: 'cat-clim-04',
        category: 'Climatización y habitáculo',
        name: 'Reemplazo de filtro deshidratador y válvula de expansión',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 75000,
        description: 'Elimina la humedad residual del circuito de aire acondicionado.'
      },
      {
        id: 'cat-clim-05',
        category: 'Climatización y habitáculo',
        name: 'Limpieza de evaporador y desinfección de conductos',
        defaultIntervalKm: 20000,
        defaultIntervalDays: 365,
        defaultCost: 40000,
        description: 'Tratamiento antibacteriano con ozono y espuma limpiadora de ductos.'
      },
      {
        id: 'cat-clim-06',
        category: 'Climatización y habitáculo',
        name: 'Mantenimiento o reemplazo del compresor de aire acondicionado',
        defaultIntervalKm: 90000,
        defaultIntervalDays: 1825,
        defaultCost: 260000,
        description: 'Reemplazo de embrague magnético o válvula electrónica de cilindrada variable.'
      },
      {
        id: 'cat-clim-07',
        category: 'Climatización y habitáculo',
        name: 'Limpieza o reemplazo del condensador de aire acondicionado',
        defaultIntervalKm: 70000,
        defaultIntervalDays: 1460,
        defaultCost: 110000,
        description: 'Desobstrucción de insectos y tierra de las aletas del frente del radiador.'
      }
    ]
  },
  {
    category: 'Sistema de escape y control de emisiones',
    iconName: 'Activity',
    services: [
      {
        id: 'cat-esc-01',
        category: 'Sistema de escape y control de emisiones',
        name: 'Limpieza o reemplazo de convertidor catalítico (catalizador)',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 230000,
        description: 'Reducción de emisiones CO y NOx; garantiza aprobación de verificación técnica (VTV/RTO).'
      },
      {
        id: 'cat-esc-02',
        category: 'Sistema de escape y control de emisiones',
        name: 'Regeneración o limpieza de filtro de partículas (DPF / FAP)',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 95000,
        description: 'Regeneración forzada por scanner o lavado químico de hollín y cenizas.'
      },
      {
        id: 'cat-esc-03',
        category: 'Sistema de escape y control de emisiones',
        name: 'Recarga de líquido reductor de emisiones (AdBlue / urea)',
        defaultIntervalKm: 15000,
        defaultIntervalDays: 365,
        defaultCost: 35000,
        description: 'Solución de urea automotriz grado AUS32 para catalizador SCR.'
      },
      {
        id: 'cat-esc-04',
        category: 'Sistema de escape y control de emisiones',
        name: 'Reemplazo de silenciadores y resonadores',
        defaultIntervalKm: 70000,
        defaultIntervalDays: 1460,
        defaultCost: 120000,
        description: 'Silenciadores traseros e intermedios para reducir decibeles.'
      },
      {
        id: 'cat-esc-05',
        category: 'Sistema de escape y control de emisiones',
        name: 'Reparación de fugas y reemplazo de cañerías y juntas de escape',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 60000,
        description: 'Sellado de uniones, abrazaderas y bridas del múltiple de escape.'
      },
      {
        id: 'cat-esc-06',
        category: 'Sistema de escape y control de emisiones',
        name: 'Reemplazo de soportes de goma del sistema de escape',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 25000,
        description: 'Tirajes elásticos para que el caño de escape no golpee contra el chasis.'
      }
    ]
  },
  {
    category: 'Sistema de combustible y admisión',
    iconName: 'Fuel',
    services: [
      {
        id: 'cat-comb-01',
        category: 'Sistema de combustible y admisión',
        name: 'Limpieza de tanque de combustible',
        defaultIntervalKm: 70000,
        defaultIntervalDays: 1460,
        defaultCost: 65000,
        description: 'Vaciado y aspiración de barro y lodos del fondo del depósito.'
      },
      {
        id: 'cat-comb-02',
        category: 'Sistema de combustible y admisión',
        name: 'Reemplazo de bomba de combustible y prefiltro',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 130000,
        description: 'Módulo de bomba sumergida con regulador y aforador de nivel.'
      },
      {
        id: 'cat-comb-03',
        category: 'Sistema de combustible y admisión',
        name: 'Revisión y reemplazo del regulador de presión de combustible',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 55000,
        description: 'Presión constante en rampa (3 a 4 bar) sin oscilaciones.'
      },
      {
        id: 'cat-comb-04',
        category: 'Sistema de combustible y admisión',
        name: 'Reemplazo de filtro de carbón activado (cánister) y válvula de purga',
        defaultIntervalKm: 70000,
        defaultIntervalDays: 1460,
        defaultCost: 65000,
        description: 'Control de vapores de combustible; evita olor a nafta en el habitáculo.'
      },
      {
        id: 'cat-comb-05',
        category: 'Sistema de combustible y admisión',
        name: 'Limpieza de múltiple de admisión',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 70000,
        description: 'Remoción de residuos oleosos para un flujo laminar parejo en los cilindros.'
      },
      {
        id: 'cat-comb-06',
        category: 'Sistema de combustible y admisión',
        name: 'Limpieza de intercooler y mangueras de admisión',
        defaultIntervalKm: 50000,
        defaultIntervalDays: 730,
        defaultCost: 60000,
        description: 'Enfría el aire de sobrealimentación para una mayor densidad de oxígeno.'
      }
    ]
  },
  {
    category: 'Carrocería, visibilidad y chasis',
    iconName: 'Shield',
    services: [
      {
        id: 'cat-car-01',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Cambio de escobillas limpiaparabrisas (delanteras y trasera)',
        defaultIntervalKm: 15000,
        defaultIntervalDays: 365,
        defaultCost: 25000,
        description: 'Escobillas de goma siliconada de barrido silencioso sin marcas.'
      },
      {
        id: 'cat-car-02',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Recarga de líquido limpiaparabrisas y destapado de sapitos',
        defaultIntervalKm: 5000,
        defaultIntervalDays: 90,
        defaultCost: 10000,
        description: 'Líquido desengrasante anticongelante y desobstrucción de boquillas.'
      },
      {
        id: 'cat-car-03',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Reparación o cambio de bomba de agua de limpiaparabrisas',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 35000,
        description: 'Motor eléctrico presurizador del depósito de agua de parabrisas.'
      },
      {
        id: 'cat-car-04',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Lubricación de bisagras, cerraduras y levanta cristales',
        defaultIntervalKm: 20000,
        defaultIntervalDays: 365,
        defaultCost: 20000,
        description: 'Grasa blanca de litio y silicona en colisas de puertas y baúl.'
      },
      {
        id: 'cat-car-05',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Limpieza de desagües de techo corredizo, torpedo y puertas',
        defaultIntervalKm: 20000,
        defaultIntervalDays: 365,
        defaultCost: 25000,
        description: 'Previene filtraciones de agua al piso del habitáculo y cortocircuitos.'
      },
      {
        id: 'cat-car-06',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Reemplazo de burletes de puertas, baúl y ventanillas',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 60000,
        description: 'Aislación acústica y hermética contra viento y polvo en ruta.'
      },
      {
        id: 'cat-car-07',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Cambio de amortiguadores de capot y portón trasero',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 45000,
        description: 'Pistones neumáticos a gas que sostienen las compuertas abiertas.'
      },
      {
        id: 'cat-car-08',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Lavado de carrocería, chasis y motor',
        defaultIntervalKm: 5000,
        defaultIntervalDays: 90,
        defaultCost: 30000,
        description: 'Lavado integral con desengrasante dieléctrico y secado por turbina.'
      },
      {
        id: 'cat-car-09',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Descontaminado, pulido, encerado y sellado de pintura',
        defaultIntervalKm: 30000,
        defaultIntervalDays: 365,
        defaultCost: 95000,
        description: 'Protección acrílica o cerámica para preservar el barniz original de fábrica.'
      },
      {
        id: 'cat-car-10',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Pulido de ópticas (faros)',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 40000,
        description: 'Eliminación del amarillento por radiación UV y aplicación de sellador protector.'
      },
      {
        id: 'cat-car-11',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Limpieza e hidratación de tapizados e interior',
        defaultIntervalKm: 20000,
        defaultIntervalDays: 365,
        defaultCost: 50000,
        description: 'Nutrición de cuero y desmanchado de telas con aspiración profunda.'
      },
      {
        id: 'cat-car-12',
        category: 'Carrocería, visibilidad y chasis',
        name: 'Tratamiento anticorrosivo y protección de bajos (subchasis)',
        defaultIntervalKm: 80000,
        defaultIntervalDays: 1460,
        defaultCost: 120000,
        description: 'Pintura asfáltica o poliuretánica protectora contra piedras y salitre.'
      }
    ]
  },
  {
    category: 'Seguridad pasiva y accesorios',
    iconName: 'LifeBuoy',
    services: [
      {
        id: 'cat-seg-01',
        category: 'Seguridad pasiva y accesorios',
        name: 'Revisión del sistema de airbags y pretensores de cinturones',
        defaultIntervalKm: 60000,
        defaultIntervalDays: 1095,
        defaultCost: 50000,
        description: 'Verificación de resistencia pirotécnica y módulo sensor de impacto (SRS).'
      },
      {
        id: 'cat-seg-02',
        category: 'Seguridad pasiva y accesorios',
        name: 'Revisión de mecanismo de cinturones de seguridad',
        defaultIntervalKm: 40000,
        defaultIntervalDays: 730,
        defaultCost: 35000,
        description: 'Retractores automáticos y anclajes con traba inercial.'
      },
      {
        id: 'cat-seg-03',
        category: 'Seguridad pasiva y accesorios',
        name: 'Calibración de cámaras y radares ADAS',
        defaultIntervalKm: 30000,
        defaultIntervalDays: 730,
        defaultCost: 90000,
        description: 'Calibración estática y dinámica de frenado autónomo y mantenimiento de carril.'
      },
      {
        id: 'cat-seg-04',
        category: 'Seguridad pasiva y accesorios',
        name: 'Calibración y reemplazo de sensores TPMS',
        defaultIntervalKm: 30000,
        defaultIntervalDays: 730,
        defaultCost: 55000,
        description: 'Baterías y frecuencias de los sensores de presión de inflado en llantas.'
      },
      {
        id: 'cat-seg-05',
        category: 'Seguridad pasiva y accesorios',
        name: 'Control de bocina (claxon)',
        defaultIntervalKm: 20000,
        defaultIntervalDays: 365,
        defaultCost: 15000,
        description: 'Potencia acústica y contactos de volante / cinta espiral (clockspring).'
      }
    ]
  }
];

export const ALL_CATALOG_SERVICES: CatalogServiceItem[] = SERVICE_CATEGORIES.flatMap(cat => cat.services);
