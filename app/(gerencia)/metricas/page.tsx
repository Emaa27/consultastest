// app/gerencia/metricas/page.tsx
'use client';

import Link from 'next/link';
import { TurnosPieChart } from '@/components/TurnosPieChart';
import { ObraSocialPieChart } from '@/components/ObraSocialPieChart';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Íconos SVG (Basados en tu código de Navbar)
type IconProps = { className?: string };

const UserCheck = ({ className }: IconProps) => ( // Para 'Atendidos'
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17,11 19,13 23,9"></polyline>
  </svg>
);

const Calendar = ({ className }: IconProps) => ( // Para el calendario
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const UserPlus = ({ className }: IconProps) => ( // Para 'Nuevos Pacientes'
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="17" y1="11" x2="23" y2="11"></line>
  </svg>
);

const Clock = ({ className }: IconProps) => ( // Para 'Actividad Reciente'
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const XCircle = ({ className }: IconProps) => ( // Para 'Cancelaciones'
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);


// --- Componente KpiCard (Indicadores clave) ---
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

// --- Componente PieChartPlaceholder (Para tus gráficos de torta) ---


// --- Componente ActivityLog (Registro de actividad) ---
const ActivityLog = () => {
    const [activities, setActivities] = useState<Array<{ time: string; description: string; tipo: string }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/gerencia/actividad-reciente?limite=5');
                const result = await response.json();
                
                if (result.actividades && Array.isArray(result.actividades)) {
                    setActivities(result.actividades);
                }
            } catch (error) {
                console.error('Error cargando actividad reciente:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);
    
    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-[#16a34a]" />
                Actividad Reciente
            </h3>
            {loading ? (
                <div className="py-8 text-center text-gray-500">Cargando actividad...</div>
            ) : activities.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No hay actividad reciente</div>
            ) : (
                <ul className="space-y-4">
                    {activities.map((activity, index) => (
                        <li key={index} className="flex items-start border-l-4 border-[#86efac] pl-3">
                            <div className="text-sm">
                                <span className="font-bold text-gray-900 mr-2">{activity.time}</span>
                                <span className="text-gray-700 inline">
                                    <ReactMarkdown 
                                        components={{
                                            p: ({node, ...props}) => <span {...props} />,
                                            strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />
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
            <Link href="/gerencia/historialturnos" className="mt-6 inline-block text-sm text-green-600 font-medium hover:text-green-700 transition-colors">
                Ver historial completo &rarr;
            </Link>
        </div>
    );
}





export default function GerenciaDashboardPage() {
    const [kpis, setKpis] = useState({
        citasAgendadas: 0,
        citasAtendidas: 0,
        nuevosPacientes: 0,
        cancelaciones: 0,
    });
    const [loadingKpis, setLoadingKpis] = useState(true);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [gerenteName, setGerenteName] = useState('Gerente');

    const fetchKpis = async () => {
        try {
            setLoadingKpis(true);
            let url = '/api/gerencia/kpis';
            
            if (fechaInicio && fechaFin) {
                url += `?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            setKpis({
                citasAgendadas: data.citasAgendadas || 0,
                citasAtendidas: data.citasAtendidas || 0,
                nuevosPacientes: data.nuevosPacientes || 0,
                cancelaciones: data.cancelaciones || 0,
            });
        } catch (error) {
            console.error('Error cargando KPIs:', error);
        } finally {
            setLoadingKpis(false);
        }
    };

    useEffect(() => {
        // Obtener nombre del usuario desde localStorage
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setGerenteName(user.nombre || 'Gerente');
            }
        } catch (error) {
            console.error('Error al obtener usuario:', error);
        }

        fetchKpis();
    }, []);

    const aplicarFiltro = () => {
        fetchKpis();
    };

    const limpiarFiltro = () => {
        setFechaInicio('');
        setFechaFin('');
        setTimeout(() => fetchKpis(), 0);
    };
    
    return (
        <main className="p-6 bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
            <div className="space-y-8">
                {/* 1. Cabecera y Bienvenida (¡El cartel de bienvenida!) */}
                <header className="p-6 bg-gradient-to-r from-[#16a34a] to-[#86efac] text-white rounded-xl shadow-xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold">
                        ¡Bienvenido/a, {gerenteName}!
                    </h1>
                    <p className="mt-2 text-green-100 text-lg">
                        Revisa la actividad y el rendimiento de tu consultorio.
                    </p>

                    {/* Filtro de fechas */}
                    <div className="mt-4 flex flex-wrap items-end gap-3">
                        <div>
                            <label className="block text-sm font-medium text-green-100 mb-1">
                                Desde
                            </label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="px-3 py-2 border border-green-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-green-100 mb-1">
                                Hasta
                            </label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                className="px-3 py-2 border border-green-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={aplicarFiltro}
                            disabled={!fechaInicio || !fechaFin}
                            className="px-4 py-2 bg-white text-green-700 font-medium rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Aplicar Filtro
                        </button>
                        {(fechaInicio || fechaFin) && (
                            <button
                                onClick={limpiarFiltro}
                                className="px-4 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors"
                            >
                                Ver Hoy
                            </button>
                        )}
                    </div>
                </header>
            
                {/* KPIs Destacados */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title={fechaInicio && fechaFin ? "Citas Agendadas" : "Citas Agendadas Hoy"} value={kpis.citasAgendadas} icon={Calendar} colorClass="text-indigo-600" loading={loadingKpis} />
                    <KpiCard title={fechaInicio && fechaFin ? "Citas Atendidas" : "Citas Atendidas Hoy"} value={kpis.citasAtendidas} icon={UserCheck} colorClass="text-green-600" loading={loadingKpis} />
                    <KpiCard title="Nuevos Pacientes" value={kpis.nuevosPacientes} icon={UserPlus} colorClass="text-amber-600" loading={loadingKpis} />
                    <KpiCard title="Cancelaciones" value={kpis.cancelaciones} icon={XCircle} colorClass="text-red-600" loading={loadingKpis} />
                </div>

                {/* Contenido Principal: Actividad Reciente */}
                <ActivityLog />

                {/* 3. Métricas Clave (Gráficos de Torta) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* ⬅️ REEMPLAZO: Gráfico 1 - Turnos REAL */}
                    <TurnosPieChart />

                    {/* ⬅️ REEMPLAZO: Gráfico 2 - Obra Social REAL */}
                    <ObraSocialPieChart />

                </div>
            </div>
        </main>
    );
}