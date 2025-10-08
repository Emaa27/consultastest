// app/gerencia/metricas/page.tsx

import Link from 'next/link';
import { TurnosPieChart } from '@/components/TurnosPieChart';
import { ObraSocialPieChart } from '@/components/ObraSocialPieChart';

// Íconos SVG (Basados en tu código de Navbar)
type IconProps = { className?: string };

const BarChart3 = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

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
const KpiCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: string, icon: any, colorClass: string }) => (
  <div className="flex flex-col items-start p-4 bg-white rounded-xl shadow-lg border-b-4 border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <Icon className={`h-8 w-8 mb-3 ${colorClass}`} />
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
  </div>
);

// --- Componente PieChartPlaceholder (Para tus gráficos de torta) ---


// --- Componente ActivityLog (Registro de actividad) ---
const ActivityLog = () => {
    const activities = [
        { time: '12:05', description: 'Se **agendó** turno para Mario Díaz con Dr. Gómez (16:30).' },
        { time: '11:40', description: 'Paciente **Juan Pérez** marcado como **Atendido**.' },
        { time: '10:15', description: 'Se **registró** al nuevo paciente Sofía Lara.' },
        { time: '09:30', description: 'El turno de Carlos Ruiz **fue cancelado**.' },
        { time: '09:00', description: 'Se **asignó** turno a Paula Vega con Dra. García (11:00).' },
    ];
    
    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-[#16a34a]" />
                Actividad Reciente
            </h3>
            <ul className="space-y-4">
                {activities.map((activity, index) => (
                    <li key={index} className="flex items-start border-l-4 border-[#86efac] pl-3">
                        <div className="text-sm">
                            <span className="font-bold text-gray-900 mr-2">{activity.time}</span>
                            <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: activity.description }} />
                        </div>
                    </li>
                ))}
            </ul>
            <Link href="/gerencia/actividad" className="mt-6 inline-block text-sm text-green-600 font-medium hover:text-green-700 transition-colors">
                Ver historial completo &rarr;
            </Link>
        </div>
    );
}


// --- Componente SimpleCalendar (Calendario) ---
const SimpleCalendar = () => (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
             <Calendar className="w-5 h-5 mr-2 text-[#16a34a]" />
            Turnos del Mes
        </h3>
        {/* Placeholder de calendario (Puedes reemplazarlo con una librería real) */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Septiembre 2025</p>
            <div className="grid grid-cols-7 gap-1 text-xs text-center">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
                    <div key={day} className="font-bold text-gray-400">{day}</div>
                ))}
                {[...Array(30)].map((_, i) => {
                    const day = i + 1;
                    const isHighActivity = [5, 12, 19, 26].includes(day); // Días de ejemplo con alta actividad
                    const isToday = day === 8;

                    return (
                        <div 
                            key={i} 
                            className={`p-1 rounded-full cursor-pointer transition-colors duration-200 
                                ${isToday ? 'bg-green-600 text-white font-bold shadow-md' : ''}
                                ${isHighActivity && !isToday ? 'bg-green-100 text-green-800 font-medium' : 'text-gray-700 hover:bg-gray-100'}
                            `}
                            title={isHighActivity ? `Turnos: ${10 + i % 10}` : `Turnos: ${i % 5}`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-800 font-medium">
            ¡Tienes 3 alertas de turnos sin confirmar para mañana!
        </div>
    </div>
);



export default function GerenciaDashboardPage() {
    // Aquí iría tu lógica para obtener los datos del Gerente y las métricas
    const gerenteName = "Lautaro Paniuna"; // Simulación de dato
    
    return (
        <div className="p-4 sm:p-8 space-y-8 bg-gray-50 min-h-screen lg:pl-28 pt-20 lg:pt-8">
            
            {/* 1. Cabecera y Bienvenida (¡El cartel de bienvenida!) */}
            <header className="p-6 bg-gradient-to-r from-[#16a34a] to-[#86efac] text-white rounded-xl shadow-xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold">
                    ¡Bienvenido/a, {gerenteName}! 
                </h1>
                <p className="mt-2 text-green-100 text-lg">
                    Revisa la actividad y el rendimiento de tu consultorio hoy.
                </p>
            </header>
            
            {/* KPIs Destacados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Usamos colores complementarios pero el verde en el ícono */}
                <KpiCard title="Citas Agendadas Hoy" value="42" icon={Calendar} colorClass="text-indigo-600" />
                <KpiCard title="Citas Atendidas Hoy" value="28" icon={UserCheck} colorClass="text-green-600" />
                <KpiCard title="Nuevos Pacientes" value="7" icon={UserPlus} colorClass="text-amber-600" />
                <KpiCard title="Cancelaciones" value="3" icon={XCircle} colorClass="text-red-600" />
            </div>

            {/* Contenido Principal: Actividad + Gráficos + Calendario */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 2. Actividad Reciente (Columna ancha) */}
                <div className="lg:col-span-2">
                    <ActivityLog />
                </div>

                {/* 4. Calendario (Columna delgada) */}
                <SimpleCalendar />
            </div>

            {/* 3. Métricas Clave (Gráficos de Torta) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* ⬅️ REEMPLAZO: Gráfico 1 - Turnos REAL */}
                <TurnosPieChart /> 

                {/* ⬅️ REEMPLAZO: Gráfico 2 - Obra Social REAL */}
                <ObraSocialPieChart />
                
            </div>
            
        </div>
    );
}