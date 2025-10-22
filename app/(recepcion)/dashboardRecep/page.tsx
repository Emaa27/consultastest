'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// --- Importa los gráficos ---
// *** VERIFICA QUE ESTAS RUTAS SEAN CORRECTAS ***
import { FlujoDiaLineChart } from '@/components/recepcion/FlujoDiaLineChart';
import { EstadoTurnosPieChart } from '@/components/recepcion/EstadoTurnosPieChart'; // Asegúrate que este exista y reciba props
import { CargaProfesionalBarChart } from '@/components/recepcion/CargaProfesionalBarChart';

// --- Íconos ---
type IconProps = { className?: string };
const Calendar = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const Users = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const Clock = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const UserPlus = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="17" y1="11" x2="23" y2="11"></line>
  </svg>
);
// ---

// --- Componente KpiCard ---
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

// --- Componente ActivityLog (recibe props) ---
const ActivityLog = ({ activities, loading }: { activities: any[], loading: boolean }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-blue-600" />
        Actividad Reciente (Pacientes Confirmados)
      </h3>
      {loading ? (
        <div className="py-8 text-center text-gray-500">Cargando...</div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center text-gray-500">Aún no hay pacientes confirmados hoy</div>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start border-l-4 border-blue-300 pl-3">
              <div className="text-sm">
                <span className="font-bold text-gray-900 mr-2">{activity.time}</span>
                <span className="text-gray-700 inline">
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <span {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />
                    }}
                  >
                    {activity.description}
                  </ReactMarkdown>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- Página Principal del Dashboard ---
export default function RecepcionDashboardPage() {
    // --- Estado para TODOS los datos del dashboard ---
    const [kpis, setKpis] = useState({
        turnosPendientes: 0,
        pacientesEnEspera: 0,
        promedioEspera: "00:00",
        pacientesNuevosHoy: 0,
    });
    const [flujoData, setFlujoData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [activityData, setActivityData] = useState([]);
    const [cargaProfData, setCargaProfData] = useState([]); // <-- Estado para nuevo gráfico

    const [loading, setLoading] = useState(true);
    const [fecha, setFecha] = useState('');
    const [recepcionistaName, setRecepcionistaName] = useState('Usuario');

    // --- Función ÚNICA de Fetch ---
    const fetchDashboardData = async (fechaFiltro: string) => {
        if (!fechaFiltro) return;
        try {
            setLoading(true);
            // LLAMADA A LA API UNIFICADA
            const response = await fetch(`/api/recepcion/dashboard?fecha=${fechaFiltro}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Error al cargar el dashboard");

            console.log("Datos recibidos:", data); // Para depuración

            // Actualiza todos los estados con los datos de la API
            // Usamos || {} y || [] para prevenir errores si alguna parte falta en la respuesta
            setKpis(data.kpis || { turnosPendientes: 0, pacientesEnEspera: 0, promedioEspera: "00:00", pacientesNuevosHoy: 0 });
            setFlujoData(data.flujoPorHora || []);
            setPieData(data.pieEstadoTurnos || []);
            setActivityData(data.actividadReciente || []);
            setCargaProfData(data.cargaProfesionalData || []); // <-- Actualiza estado del nuevo gráfico

        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
             // Resetea estados en caso de error para evitar mostrar datos viejos
            setKpis({ turnosPendientes: 0, pacientesEnEspera: 0, promedioEspera: "00:00", pacientesNuevosHoy: 0 });
            setFlujoData([]);
            setPieData([]);
            setActivityData([]);
            setCargaProfData([]);
        } finally {
            setLoading(false);
        }
    };

    // --- Carga Inicial ---
    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setRecepcionistaName(user.nombre || 'Usuario');
            }
        } catch (error) { console.error('Error al obtener usuario:', error); }

        const hoy = new Date().toLocaleDateString('sv-SE');
        setFecha(hoy);
        fetchDashboardData(hoy); // Carga inicial con la fecha de hoy
    }, []); // Array vacío para ejecutar solo una vez

    // --- Handler para el filtro ---
    const aplicarFiltro = () => {
        fetchDashboardData(fecha); // Llama al fetch con la fecha seleccionada
    };

    return (
        <main className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
            <div className="space-y-8">
                {/* 1. Cabecera */}
                <header className="p-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-xl shadow-xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold">¡Hola, {recepcionistaName}!</h1>
                    <p className="mt-2 text-blue-100 text-lg">Resumen del flujo de pacientes.</p>

                    <div className="mt-4 flex flex-wrap items-end gap-3">
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-1">Seleccionar Día</label>
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                className="px-3 py-2 border border-blue-300 rounded-lg text-gray-900"
                            />
                        </div>
                        <button
                            onClick={aplicarFiltro}
                            className="px-4 py-2 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50"
                            disabled={loading}
                        >
                            {loading ? "Cargando..." : "Aplicar"}
                        </button>
                    </div>
                </header>

                {/* --- KPIs Destacados --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title="Pacientes en Espera" value={kpis.pacientesEnEspera} icon={Users} colorClass="text-blue-600" loading={loading} />
                    <KpiCard title="Turnos Pendientes" value={kpis.turnosPendientes} icon={Calendar} colorClass="text-indigo-600" loading={loading} />
                    <KpiCard title="Espera Promedio (MM:SS)" value={kpis.promedioEspera} icon={Clock} colorClass="text-amber-600" loading={loading} />
                    <KpiCard title="Pacientes Nuevos" value={kpis.pacientesNuevosHoy} icon={UserPlus} colorClass="text-green-600" loading={loading} />
                </div>

                {/* --- SECCIÓN DE GRÁFICOS PRINCIPALES --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gráfico de Líneas - Recibe datos del estado */}
                    <FlujoDiaLineChart data={flujoData} loading={loading} />

                    {/* Gráfico de Barras - Recibe datos del estado */}
                    <CargaProfesionalBarChart data={cargaProfData} loading={loading} />
                </div>
                {/* --- FIN SECCIÓN --- */}


                {/* Contenido Secundario: Actividad y Torta */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                         {/* ActivityLog - Recibe datos del estado */}
                        <ActivityLog activities={activityData} loading={loading} />
                    </div>
                    <div>
                        {/* Gráfico de Torta - Recibe datos del estado */}
                         {/* Usa el nombre correcto del componente importado */}
                        <EstadoTurnosPieChart data={pieData} loading={loading} />
                    </div>
                </div>

            </div>
        </main>
    );
}

// **Recordatorio**:
// 1. Asegúrate que tus componentes de gráficos (`FlujoDiaLineChart`, `EstadoTurnosPieChart`, `CargaProfesionalBarChart`)
//    estén creados en las rutas correctas y acepten las props `data` y `loading`.
// 2. Verifica que el componente de gráfico de torta se llame `EstadoTurnosPieChart`. Si usabas `TurnosPieChart`
//    para esto, necesitas renombrarlo o cambiar la importación y el uso en este archivo.