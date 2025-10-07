'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/* ---------- Íconos SVG ---------- */
type IconProps = { className?: string };

const Calendar = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Users = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FileText = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>
);

const UserCheck = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17,11 19,13 23,9"></polyline>
  </svg>
);

const LogOut = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16,17 21,12 16,7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const Menu = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const X = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

/* ---------- Componente ---------- */
export default function NavbarProfesional() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Usuario');
  const [userEmail, setUserEmail] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.nombre || 'Usuario');
        setUserEmail(user.email || '');
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
    }
  }, []);

  const menuItems = [
    { id: 'agenda', label: 'Mi Agenda', icon: Calendar, href: '/agendadiaria' },
    { id: 'pacientes', label: 'Mis Pacientes', icon: Users, href: '/profesional/pacientes' },
    { id: 'historias', label: 'Historias Clínicas', icon: FileText, href: '/profesional/historias' },
    { id: 'perfil', label: 'Mi Perfil', icon: UserCheck, href: '/profesional/perfil' },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  const handleLogout = () => {
    try {
      localStorage.clear();
    } finally {
      setIsMobileMenuOpen(false);
      router.push('/login');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col bg-white shadow-xl border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isExpanded ? 'lg:w-64' : 'lg:w-20'
        } rounded-r-3xl fixed left-0 top-0 bottom-0 z-40`}
        onMouseEnter={() => {
          const timer = setTimeout(() => setIsExpanded(true), 500);
          return () => clearTimeout(timer);
        }}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <div className={`flex ${isExpanded ? 'flex-col' : 'flex-col'} items-center space-y-3 transition-all duration-300`}>
            <img 
              src="/images/eitan-logo.png" 
              alt="EiTAN Logo" 
              className={`object-contain transition-all duration-300 ${isExpanded ? 'w-12 h-12' : 'w-10 h-10'}`} 
            />
            {isExpanded && (
              <img 
                src="/images/eitan-text.png" 
                alt="EiTAN Salta" 
                className="h-8 object-contain opacity-0 animate-fade-in" 
              />
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-hidden">
          {menuItems.map(({ id, label, icon: Icon, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={id}
                href={href}
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? 'bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={active ? 'page' : undefined}
                title={!isExpanded ? label : undefined}
              >
                <Icon className={`flex-shrink-0 transition-all duration-200 ${isExpanded ? 'w-5 h-5' : 'w-6 h-6'}`} />
                {isExpanded && (
                  <span className="ml-3 font-medium whitespace-nowrap opacity-0 animate-fade-in">
                    {label}
                  </span>
                )}
                
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Usuario y Logout */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className={`flex items-center ${isExpanded ? 'px-3' : 'justify-center'} transition-all duration-300`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6596d8] to-[#b5e4e6] flex items-center justify-center text-white font-bold flex-shrink-0">
              {getInitials(userName)}
            </div>
            {isExpanded && (
              <div className="ml-3 opacity-0 animate-fade-in overflow-hidden">
                <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group relative ${
              !isExpanded && 'justify-center'
            }`}
            title={!isExpanded ? 'Cerrar sesión' : undefined}
          >
            <LogOut className={`flex-shrink-0 transition-all duration-200 ${isExpanded ? 'w-5 h-5' : 'w-6 h-6'}`} />
            {isExpanded && (
              <span className="ml-3 font-medium opacity-0 animate-fade-in">Cerrar sesión</span>
            )}
            
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Cerrar sesión
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50 border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <img src="/images/eitan-logo.png" alt="EiTAN Logo" className="w-8 h-8 object-contain" />
            <img src="/images/eitan-text.png" alt="EiTAN Salta" className="h-6 object-contain" />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-[#6596d8] hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg rounded-r-3xl" onClick={(e) => e.stopPropagation()}>
            <nav className="p-4 space-y-2">
              {menuItems.map(({ id, label, icon: Icon, href }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={id}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6596d8] to-[#b5e4e6] flex items-center justify-center text-white font-bold">
                    {getInitials(userName)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-800">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Cerrar sesión</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}