// app/(profesional)/dashboard/page.tsx
'use client';

import { init } from 'next/dist/compiled/webpack/webpack';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';

// --- Íconos ---
type IconProps = { className?: string };

const Calendar = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const UserCheck = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17,11 19,13 23,9"></polyline>
  </svg>
);
const Clock = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// --- Componente KPI ---
const KpiCard = ({ title, value, icon: Icon, colorClass, loading }: { title: string, value: string | number, icon: any, colorClass: string, loading?: boolean }) => (
  <div className="flex flex-col items-start p-4 bg-white rounded-xl shadow-lg border-b-4 border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <Icon className={`h-8 w-8 mb-3 ${colorClass}`} />
    <p className="text-sm font-medium text-gray-500">{title}</p>
    {loading ? (
      <p className="text-2xl font-extrabold text-gray-400 mt-1">...</p>
    ) : (
      <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
    )}
  </div>
);

// --- Dashboard principal ---
export default function ProfesionalDashboardPage() {
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [kpis, setKpis] = useState<any>({});
  const [obrasSociales, setObrasSociales] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [fechas, setFechas] = useState<any[]>([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [profesionalId, setProfesionalId] = useState<number | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');

  // 🔹 Cargar usuario logueado
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setNombreUsuario(user.nombre || 'Usuario');
      setProfesionalId(user.profesionalId || user.id);
    }

    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setDate(hoy.getDate() - 30);

    // Función para formatear a "YYYY-MM-DD"
    const toDateInputValue = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    setFechaInicio(toDateInputValue(haceUnMes));
    setFechaFin(toDateInputValue(hoy));
  }, []);

  const fetchKpis = async () => {
    if (!profesionalId) return;
    setLoadingKpis(true);

    const params = new URLSearchParams();
    params.set('profesional_id', profesionalId.toString());
    if (fechaInicio) params.set('fechaInicio', fechaInicio);
    if (fechaFin) params.set('fechaFin', fechaFin);

    try {
      const res = await fetch(`/api/profesionales/kpis?${params.toString()}`);
      const data = await res.json();

      if (data.indicadores) setKpis(data.indicadores);
      if (data.obrasSociales) setObrasSociales(data.obrasSociales);
      if (data.estados) setEstados(data.estados);
      if (data.fechas) setFechas(data.fechas);
    } catch (err) {
      console.error('Error cargando KPIs:', err);
    } finally {
      setLoadingKpis(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, [profesionalId]);

  // Función para formatear el tooltip (que aparecerá al pasar el mouse)
  const obrasSocialesTooltipHandler = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const name = payload[0].name;

      const total = obrasSociales.reduce((sum, item) => sum + item.value, 0);
      const percent = total > 0 ? (value / total) * 100 : 0;

      return (
        <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-gray-800">{name}</p>
          <p className="text-gray-600">
            Total: {value} ({percent.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Función para formatear el tooltip (que aparecerá al pasar el mouse)
  const estadosTooltipHandler = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const name = payload[0].name;

      const total = estados.reduce((sum, item) => sum + item.value, 0);
      const percent = total > 0 ? (value / total) * 100 : 0;

      return (
        <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-gray-800">{name}</p>
          <p className="text-gray-600">
            Total: {value} ({percent.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Función para formatear el tooltip (que aparecerá al pasar el mouse)
  const fechasTooltipHandler = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const name = payload[0].name;

      return (
        <div className="p-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm">
          <p className="font-bold text-gray-800">{name}</p>
          <p className="text-gray-600">
            Total: {value}
          </p>
        </div>
      );
    }
    return null;
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7", "#EC4899"];

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen lg:pl-28 pt-20 lg:pt-8">
      {/* --- Encabezado --- */}
      <header className="p-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl shadow-xl">
        <h1 className="text-3xl font-extrabold">¡Hola, {nombreUsuario}!</h1>
        <p className="mt-1 text-blue-100">Resumen de rendimiento y actividad reciente.</p>

        <div className="mt-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Desde</label>
            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="px-3 py-2 border border-blue-300 rounded-lg text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Hasta</label>
            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="px-3 py-2 border border-blue-300 rounded-lg text-gray-900" />
          </div>
          <button onClick={fetchKpis} className="px-4 py-2 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50">Aplicar</button>
        </div>
      </header>

      {/* --- KPIs --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Promedio Diario de Turnos" value={kpis.promedioDiarioTurnos || 0} icon={Calendar} colorClass="text-indigo-600" loading={loadingKpis} />
        <KpiCard title="Pacientes únicos" value={kpis.pacientesUnicos || 0} icon={UserCheck} colorClass="text-sky-600" loading={loadingKpis} />
        <KpiCard title="Promedio de Espera" value={kpis.tiempoPromedioEspera || "00:00:00"} icon={Clock} colorClass="text-amber-600" loading={loadingKpis} />
        <KpiCard title="Promedio de Atención" value={kpis.tiempoPromedioConsulta || "00:00:00"} icon={Clock} colorClass="text-blue-600" loading={loadingKpis} />
      </div>

      {/* --- Gráficos --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Distribución por Obra Social</h3>
            <p className="text-sm text-gray-500 mb-4">Turnos agrupados por tipo de Obra Social o Particular.</p>
            
            {loadingKpis ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Cargando datos...</p>
              </div>
            ) : obrasSociales.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No hay datos disponibles</p>
              </div>
            ) : (
              <div className="h-64"> 
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={obrasSociales}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      nameKey="name"
                      dataKey="value"
                      labelLine={false}
                    >
                      {obrasSociales.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                        fill={entry.color || COLORS[index % COLORS.length]} 
                        stroke={entry.color || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                    />
                    
                    <Tooltip content={obrasSocialesTooltipHandler} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Distribución por Estado</h3>
            <p className="text-sm text-gray-500 mb-4">Turnos agrupados por Estado.</p>
            
            {loadingKpis ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Cargando datos...</p>
              </div>
            ) : estados.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No hay datos disponibles</p>
              </div>
            ) : (
              <div className="h-64"> 
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estados}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      nameKey="name"
                      dataKey="value"
                      labelLine={false}
                    >
                      {estados.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                        fill={entry.color || COLORS[index % COLORS.length]} 
                        stroke={entry.color || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    
                    <Legend 
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                    />
                    
                    <Tooltip content={estadosTooltipHandler} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
      </div>
      <div className="grid grid-cols-1">
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Distribución por Fecha</h3>
            <p className="text-sm text-gray-500 mb-4">Turnos agrupados por Fecha.</p>
            
            {loadingKpis ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">Cargando datos...</p>
              </div>
            ) : estados.length === 0 ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-gray-500">No hay datos disponibles</p>
              </div>
            ) : (
              <div className="h-64"> 
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fechas}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value} turnos`, "Cantidad"]}
                      labelFormatter={(label) => `Fecha: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}