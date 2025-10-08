'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Datos de ejemplo simulados para el estado de los turnos
const data = [
  { name: 'Atendidos', value: 65, color: '#16a34a' },     // Verde Fuerte
  { name: 'Pendientes', value: 20, color: '#86efac' },    // Verde Claro (Degradé)
  { name: 'Cancelados', value: 10, color: '#EF4444' },    // Rojo
  { name: 'Ausentes', value: 5, color: '#FCD34D' },       // Amarillo (Complementario)
];

// Función para formatear el tooltip (que aparecerá al pasar el mouse)
const renderTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-gray-800">{payload[0].name}</p>
        <p className="text-gray-600">Total: {payload[0].value} ({payload[0].percent * 100}%)</p>
      </div>
    );
  }
  return null;
};

export const TurnosPieChart = () => (
  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
    <h3 className="text-lg font-bold text-gray-800 mb-2">Estado de los Turnos (Últimos 7 días)</h3>
    <p className="text-sm text-gray-500 mb-4">Proporción de turnos Atendidos vs. Cancelados vs. Pendientes.</p>
    
    <div className="h-64"> 
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* El gráfico de torta en sí */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60} // Para hacerlo un 'donut'
            outerRadius={90} // Tamaño del gráfico
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
          >
            {/* Asignación de colores a cada porción */}
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke={entry.color} 
              />
            ))}
          </Pie>
          
          {/* Componente para mostrar la leyenda (colores y nombres) */}
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right" 
          />
          
          {/* Componente para el mensaje emergente al pasar el mouse */}
          <Tooltip content={renderTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);