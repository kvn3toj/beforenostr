import React from 'react';
import { safeToLocaleString } from '../../../utils/numberUtils';
import { calculateAyniEfficiency, calculateCommunityImpact } from '../../../hooks/home';

interface MetricsRelationshipsProps {
  ondas: number;
  meritos: number;
  ayniBalance: number;
  className?: string;
}

export const MetricsRelationships: React.FC<MetricsRelationshipsProps> = ({
  ondas,
  meritos,
  ayniBalance,
  className,
}) => {
  const ayniEfficiency = calculateAyniEfficiency(meritos, ondas);
  const communityImpact = calculateCommunityImpact(ayniBalance * 100, meritos);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (efficiency >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (efficiency >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 400) return 'text-purple-600 bg-purple-50 border-purple-200';
    if (impact >= 300) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (impact >= 200) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getEfficiencyMessage = (efficiency: number) => {
    if (efficiency >= 80) return 'Excelente conversión de energía';
    if (efficiency >= 60) return 'Buena eficiencia en Ayni';
    if (efficiency >= 40) return 'Oportunidad de mejora';
    return 'Enfócate en generar más Mëritos';
  };

  const getImpactMessage = (impact: number) => {
    if (impact >= 400) return 'Impacto transformador';
    if (impact >= 300) return 'Contribución significativa';
    if (impact >= 200) return 'Buen aporte comunitario';
    return 'Construyendo tu legado';
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 ${className || ''}`}>
      {/* Eficiencia Ayni */}
      <div
        className={`
          relative p-4 rounded-xl border-2 transition-all duration-300
          hover:scale-105 hover:shadow-lg group cursor-pointer
          ${getEfficiencyColor(ayniEfficiency)}
        `}
      >
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">
            {ayniEfficiency.toFixed(1)}%
          </div>
          <div className="text-sm font-semibold mb-1">
            Eficiencia Ayni
          </div>
          <div className="text-xs opacity-75 mb-2">
            Mëritos generados por Öndas
          </div>
          <div className="text-xs font-medium">
            {getEfficiencyMessage(ayniEfficiency)}
          </div>
        </div>

        {/* Indicador visual de progreso */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-xl">
          <div
            className="h-full bg-current rounded-b-xl transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(100, ayniEfficiency)}%` }}
          />
        </div>

        {/* Tooltip expandido en hover */}
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Öndas invertidas:</span>
              <span className="font-semibold">{safeToLocaleString(ondas)}</span>
            </div>
            <div className="flex justify-between">
              <span>Mëritos obtenidos:</span>
              <span className="font-semibold">{safeToLocaleString(meritos)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ratio de conversión:</span>
              <span className="font-semibold">1:{(ondas / Math.max(meritos, 1)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Impacto Comunitario */}
      <div
        className={`
          relative p-4 rounded-xl border-2 transition-all duration-300
          hover:scale-105 hover:shadow-lg group cursor-pointer
          ${getImpactColor(communityImpact)}
        `}
      >
        <div className="text-center">
          <div className="text-2xl font-bold mb-1">
            {Math.round(communityImpact)}
          </div>
          <div className="text-sm font-semibold mb-1">
            Impacto Comunitario
          </div>
          <div className="text-xs opacity-75 mb-2">
            Contribución al Bien Común
          </div>
          <div className="text-xs font-medium">
            {getImpactMessage(communityImpact)}
          </div>
        </div>

        {/* Indicador visual de progreso */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-10 rounded-b-xl">
          <div
            className="h-full bg-current rounded-b-xl transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(100, (communityImpact / 500) * 100)}%` }}
          />
        </div>

        {/* Tooltip expandido en hover */}
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Balance Ayni:</span>
              <span className="font-semibold">{(ayniBalance * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Mëritos totales:</span>
              <span className="font-semibold">{safeToLocaleString(meritos)}</span>
            </div>
            <div className="flex justify-between">
              <span>Factor multiplicador:</span>
              <span className="font-semibold">x{ayniBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conexión visual entre métricas */}
      <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
      </div>
    </div>
  );
}; 