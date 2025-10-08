'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { UserPlus } from 'lucide-react'; // Ícono para usar como referencia

// Datos de ejemplo simulados para la distribución por Obra Social
// Usamos colores corporativos, pero priorizando diferenciación
const data = [
  { name: 'Particular', value: 350, color: '#FCD34D' },    // Amarillo/Mostaza
  { name: 'OSDE', value: 250, color: '#3B82F6' },          // Azul Principal
  { name: 'PAMI', value: 150, color: '#16a34a' },          // Verde (Tu color principal)
  { name: 'Galeno', value: 100, color: '#EF4444' },        // Rojo
  { name: 'Swiss Medical', value: 80, color: '#C084FC' },  // Púrpura
  { name: 'Otras', value: 70, color: '#6B7280' },          // Gris
];

// Función para formatear el tooltip (que aparecerá al pasar el mouse)
const renderTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const totalPatients = data.reduce((sum, entry) => sum + entry.value, 0);
    const percentage = ((payload[0].value / totalPatients) * 100).toFixed(1);
    
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

export const ObraSocialPieChart = () => (
  <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
    <h3 className="text-lg font-bold text-gray-800 mb-2">Distribución por Obra Social (Mensual)</h3>
    <p className="text-sm text-gray-500 mb-4">Pacientes atendidos agrupados por tipo de Obra Social o Particular.</p>
    
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