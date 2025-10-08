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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gerencia/obras-sociales');
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

    fetchData();
  }, []);

  // Función para formatear el tooltip
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : '0';
      
      return (
        <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-gray-800">{payload[0].name}</p>
          <p className="text-gray-600">Pacientes: {payload[0].value}</p>
          <p className="text-gray-600">Representa: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Distribución por Obra Social (Mensual)</h3>
      <p className="text-sm text-gray-500 mb-4">Pacientes atendidos agrupados por tipo de Obra Social o Particular.</p>
      
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