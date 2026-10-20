import { Vehicle, FuelLog, ServiceItem, MonthlyMatrixRow, ServiceStatus } from '../types/vehicle';

/**
 * Calcula y enriquece el historial de cargas de nafta con el algoritmo de cargas parciales.
 */
export function calculateFuelLogs(logs: FuelLog[], vehicle: Vehicle): FuelLog[] {
  if (!logs || logs.length === 0) return [];

  // Ordenar cronológicamente por odómetro ascendente
  const sorted = [...logs].sort((a, b) => a.odometer - b.odometer);

  let lastFullTankOdometer = vehicle.initialOdometer;
  let accumulatedPartialLiters = 0;
  let accumulatedPartialCost = 0;

  return sorted.map((log, index) => {
    const prevOdometer = index === 0 ? vehicle.initialOdometer : sorted[index - 1].odometer;
    const tripDistance = Math.max(0, log.odometer - prevOdometer);

    // Calcular costo por litro si no viene provisto
    const costPerLiter = log.costPerLiter > 0 
      ? log.costPerLiter 
      : (log.liters > 0 ? Math.round((log.totalCost / log.liters) * 100) / 100 : 0);

    const costPerKm = tripDistance > 0 ? Math.round((log.totalCost / tripDistance) * 100) / 100 : 0;

    if (!log.isFullTank) {
      // Carga Parcial: Se acumula para la próxima carga completa
      accumulatedPartialLiters += log.liters;
      accumulatedPartialCost += log.totalCost;

      return {
        ...log,
        costPerLiter,
        tripDistance,
        realEfficiencyKmPerL: null,
        consumptionLPer100Km: null,
        costPerKm,
        calculationNote: 'Acumulando (Carga Parcial)'
      };
    } else {
      // Carga Tanque Lleno: Se computa el tramo completo desde el último tanque lleno
      const totalLitersInSpan = accumulatedPartialLiters + log.liters;
      const totalCostInSpan = accumulatedPartialCost + log.totalCost;
      const totalSpanDistance = log.odometer - lastFullTankOdometer;

      let realEfficiencyKmPerL: number | null = null;
      let consumptionLPer100Km: number | null = null;
      let note = 'Tanque lleno individual';

      if (totalSpanDistance > 0 && totalLitersInSpan > 0) {
        realEfficiencyKmPerL = Math.round((totalSpanDistance / totalLitersInSpan) * 100) / 100;
        consumptionLPer100Km = Math.round((100 / realEfficiencyKmPerL) * 100) / 100;

        if (accumulatedPartialLiters > 0) {
          note = `Consolidado (${accumulatedPartialLiters.toFixed(1)} L parciales previos)`;
        }
      }

      // Reiniciar acumuladores para la próxima serie
      lastFullTankOdometer = log.odometer;
      accumulatedPartialLiters = 0;
      accumulatedPartialCost = 0;

      return {
        ...log,
        costPerLiter,
        tripDistance,
        realEfficiencyKmPerL,
        consumptionLPer100Km,
        costPerKm,
        calculationNote: note
      };
    }
  });
}

/**
 * Calcula el Ritmo Diario Histórico en km/día
 */
export function calculateDailyRhythm(logs: FuelLog[], vehicle: Vehicle): number {
  if (!logs || logs.length < 2) return 42; // Valor por defecto realista (42 km/día)

  const sorted = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstDate = new Date(sorted[0].date).getTime();
  const lastDate = new Date(sorted[sorted.length - 1].date).getTime();

  const daysDiff = Math.max(1, Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
  const distanceTraveled = sorted[sorted.length - 1].odometer - sorted[0].odometer;

  if (distanceTraveled <= 0 || daysDiff <= 0) return 42;
  return Math.max(10, Math.round((distanceTraveled / daysDiff) * 10) / 10);
}

/**
 * Genera la Matriz Mensual analítica con variaciones y detector de anomalías
 */
export function generateMonthlyMatrix(processedLogs: FuelLog[]): MonthlyMatrixRow[] {
  if (!processedLogs || processedLogs.length === 0) return [];

  // Meses en español
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Agrupar por YYYY-MM
  const groups: { [key: string]: FuelLog[] } = {};

  processedLogs.forEach(log => {
    const d = new Date(log.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(log);
  });

  // Orden cronológico
  const sortedKeys = Object.keys(groups).sort();

  // Calcular promedio histórico global para detección de anomalías
  let grandTotalDistance = 0;
  let grandTotalLiters = 0;

  processedLogs.forEach(l => {
    grandTotalDistance += (l.tripDistance || 0);
    grandTotalLiters += l.liters;
  });

  const historicalAvgEfficiency = grandTotalLiters > 0 ? (grandTotalDistance / grandTotalLiters) : 11.5;

  let prevEfficiency: number | null = null;

  return sortedKeys.map(key => {
    const [yearStr, monthStr] = key.split('-');
    const year = parseInt(yearStr);
    const monthIndex = parseInt(monthStr) - 1;
    const monthLogs = groups[key];

    const totalDistanceKm = monthLogs.reduce((acc, l) => acc + (l.tripDistance || 0), 0);
    const totalLiters = monthLogs.reduce((acc, l) => acc + l.liters, 0);
    const totalCost = monthLogs.reduce((acc, l) => acc + l.totalCost, 0);
    const logsCount = monthLogs.length;
    const fullTanksCount = monthLogs.filter(l => l.isFullTank).length;
    const partialTanksCount = monthLogs.filter(l => !l.isFullTank).length;

    const avgCostPerKm = totalDistanceKm > 0 ? Math.round((totalCost / totalDistanceKm) * 100) / 100 : 0;
    const avgEfficiencyKmPerL = totalLiters > 0 ? Math.round((totalDistanceKm / totalLiters) * 100) / 100 : 0;
    const consumptionLPer100Km = avgEfficiencyKmPerL > 0 ? Math.round((100 / avgEfficiencyKmPerL) * 100) / 100 : 0;

    // Variación porcentual vs mes anterior
    let efficiencyChangePercent: number | null = null;
    if (prevEfficiency !== null && prevEfficiency > 0) {
      efficiencyChangePercent = Math.round(((avgEfficiencyKmPerL - prevEfficiency) / prevEfficiency) * 1000) / 10;
    }
    prevEfficiency = avgEfficiencyKmPerL;

    // Detección de Anomalía (> 15% de merma vs histórico)
    const dropVsHistorical = historicalAvgEfficiency > 0 
      ? ((historicalAvgEfficiency - avgEfficiencyKmPerL) / historicalAvgEfficiency) * 100 
      : 0;

    const hasAnomalyAlert = dropVsHistorical > 15;
    const anomalyMessage = hasAnomalyAlert 
      ? `Anomalía de consumo (-${dropVsHistorical.toFixed(1)}% vs promedio histórico): Revisar presión de neumáticos, filtro de aire o inyección`
      : undefined;

    return {
      periodKey: key,
      monthName: `${monthNames[monthIndex]} ${year}`,
      year,
      monthIndex,
      totalDistanceKm: Math.round(totalDistanceKm),
      totalLiters: Math.round(totalLiters * 10) / 10,
      logsCount,
      fullTanksCount,
      partialTanksCount,
      totalCost: Math.round(totalCost),
      avgCostPerKm,
      avgEfficiencyKmPerL,
      consumptionLPer100Km,
      efficiencyChangePercent,
      hasAnomalyAlert,
      anomalyMessage
    };
  });
}

/**
 * Evalúa el Motor Bimodal de Desgaste de Services (Km vs Días)
 */
export function evaluateServices(
  items: ServiceItem[],
  currentOdometer: number,
  dailyRhythmKm: number
): ServiceItem[] {
  const now = new Date().getTime();

  return items.map(item => {
    const kmPassed = Math.max(0, currentOdometer - item.lastServiceKm);
    const wearKmPercent = Math.min(150, Math.round((kmPassed / item.intervalKm) * 100));

    const lastServiceTime = new Date(item.lastServiceDate).getTime();
    const daysPassed = Math.max(0, Math.round((now - lastServiceTime) / (1000 * 60 * 60 * 24)));
    const wearDaysPercent = Math.min(150, Math.round((daysPassed / item.intervalDays) * 100));

    const wearTotalPercent = Math.max(wearKmPercent, wearDaysPercent);
    const remainingKm = Math.max(0, item.intervalKm - kmPassed);
    const remainingDays = Math.max(0, item.intervalDays - daysPassed);

    const effectiveRhythm = dailyRhythmKm > 0 ? dailyRhythmKm : 42;
    const projectedDaysByRhythm = Math.round(remainingKm / effectiveRhythm);

    let status: ServiceStatus = 'ok';
    let statusMessage = 'En óptimas condiciones';

    if (wearTotalPercent >= 100 || remainingKm === 0 || remainingDays === 0) {
      status = 'overdue';
      statusMessage = wearKmPercent >= 100 
        ? `Vencido por kilometraje (+${kmPassed - item.intervalKm} km)` 
        : `Vencido por tiempo (+${daysPassed - item.intervalDays} días)`;
    } else if (wearTotalPercent >= 80 || remainingKm <= 800 || remainingDays <= 30) {
      status = 'warning';
      statusMessage = `Próximo a vencer en ${remainingKm} km (~${projectedDaysByRhythm} días al ritmo actual)`;
    } else {
      status = 'ok';
      statusMessage = `Válido por ${remainingKm} km más o ${remainingDays} días`;
    }

    return {
      ...item,
      wearKmPercent,
      wearDaysPercent,
      wearTotalPercent,
      status,
      remainingKm,
      remainingDays,
      projectedDaysByRhythm,
      statusMessage
    };
  });
}
