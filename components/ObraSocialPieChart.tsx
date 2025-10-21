'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ObraSocialData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export const ObraSocialPieChart = () => {
  const [data, setData] = useState<ObraSocialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = '/api/gerencia/obras-sociales-stats';
      
      if (fechaInicio && fechaFin) {
        url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.data && Array.isArray(result.data)) {
        setData(result.data);
        setTotal(result.total || 0);
      }
    } catch (error) {
      console.error("Error cargando datos de obras sociales:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const aplicarFiltro = () => {
    fetchData();
  };

  const limpiarFiltro = () => {
    setFechaInicio('');
    setFechaFin('');
    setTimeout(() => fetchData(), 0);
  };

  // Función para formatear el tooltip
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : '0';
      
      return (
        <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-gray-800">{payload[0].name}</p>
          <p className="text-gray-600">Turnos: {payload[0].value}</p>
          <p className="text-gray-600">Representa: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Distribución por Obra Social</h3>
      <p className="text-sm text-gray-500 mb-4">Turnos agrupados por tipo de Obra Social o Particular.</p>
      
      {/* Filtro de fechas */}
      <div className="mb-4 flex flex-wrap items-end gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Desde
          </label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Hasta
          </label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={aplicarFiltro}
          disabled={!fechaInicio || !fechaFin}
          className="px-3 py-1 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Filtrar
        </button>
        {(fechaInicio || fechaFin) && (
          <button
            onClick={limpiarFiltro}
            className="px-3 py-1 text-sm bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
          >
            Limpiar
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Cargando datos...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No hay datos disponibles</p>
        </div>
      ) : (
        <div className="h-64"> 
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke={entry.color} 
                  />
                ))}
              </Pie>
              
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right" 
              />
              
              <Tooltip content={renderTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};