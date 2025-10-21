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
  <div className="group relative flex flex-col items-start p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:-translate-y-1 overflow-hidden">
    {/* Elemento decorativo de fondo */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
    
    <div className={`relative z-10 p-3 rounded-xl bg-gradient-to-br ${colorClass.includes('indigo') ? 'from-indigo-50 to-indigo-100' : colorClass.includes('green') ? 'from-green-50 to-green-100' : colorClass.includes('amber') ? 'from-amber-50 to-amber-100' : 'from-red-50 to-red-100'} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
      <Icon className={`h-7 w-7 ${colorClass}`} />
    </div>
    <p className="relative z-10 text-sm font-semibold text-gray-600 mt-4 uppercase tracking-wide">{title}</p>
    {loading ? (
      <p className="relative z-10 text-3xl font-extrabold text-gray-400 mt-2">...</p>
    ) : (
      <p className="relative z-10 text-4xl font-extrabold text-gray-900 mt-2">{value}</p>
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
        <div className="relative p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            {/* Barra decorativa lateral */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#16a34a] via-[#22c55e] to-[#86efac]"></div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center pl-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100 mr-3 shadow-sm">
                    <Clock className="w-5 h-5 text-[#16a34a]" />
                </div>
                Actividad Reciente
                {/* Pulsito decorativo */}
                <span className="ml-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            </h3>
            {loading ? (
                <div className="py-12 text-center text-gray-500 font-medium">Cargando actividad...</div>
            ) : activities.length === 0 ? (
                <div className="py-12 text-center text-gray-500 font-medium">No hay actividad reciente</div>
            ) : (
                <ul className="space-y-3">
                    {activities.map((activity, index) => (
                        <li key={index} className="flex items-start border-l-4 border-[#86efac] pl-4 py-2 hover:bg-green-50/50 rounded-r-lg transition-colors duration-200">
                            <div className="text-sm">
                                <span className="font-bold text-green-700 mr-2 bg-green-50 px-2 py-1 rounded-md">{activity.time}</span>
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
            <Link href="/gerencia/historialturnos" className="mt-6 inline-flex items-center text-sm text-green-600 font-bold hover:text-green-700 transition-colors group">
                Ver historial completo 
                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    );
}





export default function GerenciaPage() {
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
        <main className="relative p-8 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/40 min-h-screen overflow-hidden">
            {/* Elementos decorativos flotantes */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-green-100/40 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 max-w-[1600px] mx-auto space-y-8">
                {/* Barra decorativa estilo navbar */}
                <div className="h-16 bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-[#86efac] rounded-2xl shadow-xl mb-6 flex items-center px-8 relative overflow-hidden">
                    {/* Patrón decorativo */}
                    <div className="absolute inset-0 bg-white/5"></div>
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute left-0 bottom-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24"></div>
                    
                    {/* Contenido decorativo */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-white/80 rounded-full"></div>
                            <div className="w-3 h-3 bg-white/60 rounded-full"></div>
                            <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                        </div>
                        <div className="h-8 w-px bg-white/30 mx-2"></div>
                        <span className="text-white/90 font-bold text-lg">Dashboard Gerencial</span>
                    </div>
                </div>
                
                {/* 1. Cabecera y Bienvenida (¡El cartel de bienvenida!) */}
                <header 
                    className="relative p-8 text-white rounded-2xl shadow-2xl overflow-hidden border-4 border-green-200/50"
                    style={{
                        backgroundImage: 'url(/images/fondo-gerencia.jpeg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Overlay con blur y degradado */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#16a34a]/70 via-[#16a34a]/60 to-[#86efac]/50"></div>
                    
                    {/* Contenido */}
                    <div className="relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-extrabold drop-shadow-2xl text-white">
                            ¡Bienvenido/a, {gerenteName}!
                        </h1>
                        <p className="mt-3 text-white text-xl font-medium drop-shadow-xl">
                            Revisa la actividad y el rendimiento de tu consultorio.
                        </p>

                        {/* Filtro de fechas */}
                        <div className="mt-6 flex flex-wrap items-end gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2 drop-shadow-md">
                                    Desde
                                </label>
                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    className="px-4 py-2.5 border-2 border-white/30 rounded-lg text-gray-900 bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-white focus:border-white shadow-lg font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-white mb-2 drop-shadow-md">
                                    Hasta
                                </label>
                                <input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    className="px-4 py-2.5 border-2 border-white/30 rounded-lg text-gray-900 bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-white focus:border-white shadow-lg font-medium"
                                />
                            </div>
                            <button
                                onClick={aplicarFiltro}
                                disabled={!fechaInicio || !fechaFin}
                                className="px-6 py-2.5 bg-white text-green-700 font-bold rounded-lg hover:bg-white/90 hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                Aplicar Filtro
                            </button>
                            {(fechaInicio || fechaFin) && (
                                <button
                                    onClick={limpiarFiltro}
                                    className="px-6 py-2.5 bg-green-800/80 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-green-900/80 hover:scale-105 transition-all shadow-lg border-2 border-white/20"
                                >
                                    Ver Hoy
                                </button>
                            )}
                        </div>
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