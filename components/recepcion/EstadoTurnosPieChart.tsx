'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Tooltip personalizado
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

// Componente "tonto" que recibe datos
export function EstadoTurnosPieChart({ data, loading }: { data: any[], loading: boolean }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Estado de los Turnos</h3>
       {loading ? (
        <div className="h-64 flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>
      ) : !data || data.length === 0 ? (
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