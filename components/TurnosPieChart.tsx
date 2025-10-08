'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TurnoData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

// Función para formatear el tooltip (que aparecerá al pasar el mouse)
const renderTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-gray-800">{payload[0].name}</p>
        <p className="text-gray-600">Total: {payload[0].value} ({(payload[0].percent * 100).toFixed(1)}%)</p>
      </div>
    );
  }
  return null;
};

export const TurnosPieChart = () => {
  const [data, setData] = useState<TurnoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dias, setDias] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/gerencia/turnos-estado?dias=${dias}`);
        const result = await response.json();
        
        if (result.data && Array.isArray(result.data)) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error cargando datos de turnos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dias]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800">Estado de los Turnos</h3>
        <select
          value={dias}
          onChange={(e) => setDias(Number(e.target.value))}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value={7}>Últimos 7 días</option>
          <option value={15}>Últimos 15 días</option>
          <option value={30}>Últimos 30 días</option>
        </select>
      </div>
      <p className="text-sm text-gray-500 mb-4">Proporción de turnos Atendidos vs. Cancelados vs. Pendientes.</p>
      
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