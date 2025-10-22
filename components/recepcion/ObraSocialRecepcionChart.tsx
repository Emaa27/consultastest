'use client';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ChartProps {
  fechaInicio?: string;
  fechaFin?: string;
}
type PieData = { name: string; value: number; color: string; };

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-gray-800">{data.name}</p>
        <p className="text-gray-600">Total: {data.value}</p>
      </div>
    );
  }
  return null;
};

export function ObraSocialRecepcionChart({ fechaInicio, fechaFin }: ChartProps) {
  const [data, setData] = useState<PieData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (fechaInicio) params.set('fechaInicio', fechaInicio);
        if (fechaFin) params.set('fechaFin', fechaFin);
        
        // API de Gerencia que creamos antes
        const res = await fetch(`/api/gerencia/obrasocial-pie?${params.toString()}`);
        const chartData = await res.json();
        setData(chartData);
      } catch (error) {
        console.error("Error cargando gráfico de OS:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fechaInicio, fechaFin]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución por Obra Social</h3>
      {loading ? (
        <div className="h-64 flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center"><p className="text-gray-500">No hay datos</p></div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={90} fill="#8884d8" paddingAngle={5} nameKey="name" dataKey="value" labelLine={false}>
                {data.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} stroke={entry.color} />
                ))}
              </Pie>
              <Legend layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}