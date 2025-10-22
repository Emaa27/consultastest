// components/recepcion/CargaProfesionalBarChart.tsx
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-gray-800">{label}</p>
        <p className="text-gray-600">Turnos: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// Componente "tonto" que recibe datos
export function CargaProfesionalBarChart({ data, loading }: { data: any[], loading: boolean }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Carga por Profesional (Turnos Agendados)</h3>
      {loading ? (
        <div className="h-80 flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>
      ) : !data || data.length === 0 ? (
        <div className="h-80 flex items-center justify-center"><p className="text-gray-500">No hay turnos agendados para este día.</p></div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: -25, bottom: 40 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 230, 230, 0.4)' }} />
              <Bar
                dataKey="Turnos"
                fill="#8884d8" // Púrpura
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}