'use client';

import { useEffect, useState } from 'react';

// --- Importa los gráficos ---
import { FlujoDiaLineChart } from '@/components/recepcion/FlujoDiaLineChart';
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
    const [cargaProfData, setCargaProfData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [recepcionistaName, setRecepcionistaName] = useState('Usuario');

    // --- Función ÚNICA de Fetch ---
    const fetchDashboardData = async (desde: string, hasta: string) => {
        if (!desde || !hasta) return;
        try {
            setLoading(true);
            // LLAMADA A LA API UNIFICADA con rango de fechas
            const response = await fetch(`/api/recepcion/dashboard?fechaDesde=${desde}&fechaHasta=${hasta}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Error al cargar el dashboard");

            console.log("Datos recibidos:", data); // Para depuración

            // Actualiza todos los estados con los datos de la API
            setKpis(data.kpis || { turnosPendientes: 0, pacientesEnEspera: 0, promedioEspera: "00:00", pacientesNuevosHoy: 0 });
            setFlujoData(data.flujoPorHora || []);
            setCargaProfData(data.cargaProfesionalData || []);

        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
            // Resetea estados en caso de error
            setKpis({ turnosPendientes: 0, pacientesEnEspera: 0, promedioEspera: "00:00", pacientesNuevosHoy: 0 });
            setFlujoData([]);
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

        // Rango inicial: últimos 30 días
        const hoy = new Date();
        const hace30Dias = new Date();
        hace30Dias.setDate(hoy.getDate() - 30);

        const hoyStr = hoy.toLocaleDateString('sv-SE');
        const hace30DiasStr = hace30Dias.toLocaleDateString('sv-SE');

        setFechaDesde(hace30DiasStr);
        setFechaHasta(hoyStr);
        fetchDashboardData(hace30DiasStr, hoyStr); // Carga inicial
    }, []); // Array vacío para ejecutar solo una vez

    // --- Handler para el filtro ---
    const aplicarFiltro = () => {
        fetchDashboardData(fechaDesde, fechaHasta);
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
                            <label className="block text-sm font-medium text-blue-100 mb-1">Desde</label>
                            <input
                                type="date"
                                value={fechaDesde}
                                onChange={(e) => setFechaDesde(e.target.value)}
                                className="px-3 py-2 border border-blue-300 rounded-lg text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-blue-100 mb-1">Hasta</label>
                            <input
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => setFechaHasta(e.target.value)}
                                className="px-3 py-2 border border-blue-300 rounded-lg text-gray-900"
                            />
                        </div>
                        <button
                            onClick={aplicarFiltro}
                            className="px-4 py-2 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-all"
                            disabled={loading}
                        >
                            {loading ? "Cargando..." : "Aplicar Filtro"}
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
                    {/* Gráfico de Líneas - Flujo del Día */}
                    <FlujoDiaLineChart data={flujoData} loading={loading} />

                    {/* Gráfico de Barras - Carga por Profesional */}
                    <CargaProfesionalBarChart data={cargaProfData} loading={loading} />
                </div>
                {/* --- FIN SECCIÓN --- */}

            </div>
        </main>
    );
}

// **Recordatorio**:
// 1. Asegúrate que tus componentes de gráficos (`FlujoDiaLineChart`, `EstadoTurnosPieChart`, `CargaProfesionalBarChart`)
//    estén creados en las rutas correctas y acepten las props `data` y `loading`.
// 2. Verifica que el componente de gráfico de torta se llame `EstadoTurnosPieChart`. Si usabas `TurnosPieChart`
//    para esto, necesitas renombrarlo o cambiar la importación y el uso en este archivo.