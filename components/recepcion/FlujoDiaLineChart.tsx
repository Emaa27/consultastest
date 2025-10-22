'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Componente "tonto" que recibe datos
export function FlujoDiaLineChart({ data, loading }: { data: any[], loading: boolean }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Flujo de Turnos del Día</h3>
      {loading ? (
        <div className="h-80 flex items-center justify-center"><p className="text-gray-500">Cargando...</p></div>
      ) : !data || data.length === 0 ? (
        <div className="h-80 flex items-center justify-center"><p className="text-gray-500">No hay datos</p></div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Agendados" stroke="#8884d8" strokeWidth={3} name="Agendados"/>
              <Line type="monotone" dataKey="Atendidos" stroke="#00C49F" strokeWidth={2} name="Atendidos"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}