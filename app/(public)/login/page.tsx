'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const Lock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const Eye = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOff = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Stethoscope = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
    <circle cx="20" cy="10" r="2"></circle>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({ email: false, password: false });
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push(data.redirectPath);
      } else {
        setError(data.message);
        if (data.message.toLowerCase().includes('email') || data.message.toLowerCase().includes('usuario')) {
          setFieldErrors({ email: true, password: false });
        } else if (data.message.toLowerCase().includes('contraseña')) {
          setFieldErrors({ email: false, password: true });
        } else {
          setFieldErrors({ email: true, password: true });
        }
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      setFieldErrors({ email: true, password: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#2e75d4] to-[#8ddee1]"
        style={{
          backgroundImage: 'url(/images/fondo-flores.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-[#2e75d4]/60 to-[#8ddee1]/60"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
          
          <div className="bg-gradient-to-br from-[#2e75d4] to-[#8ddee1] p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative z-10 text-center">
              <div className="mb-8 inline-block">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center p-4">
                  <img
                    src= "/images/eitan-logo.png"
                    alt="Eitan Logo"
                    className='w-full h-full object-contain'
                    />
                </div>
              </div>

              <h1 className="text-5xl font-bold mb-4 tracking-tight">EiTAN</h1>
              <div className="w-20 h-1 bg-white/50 mx-auto mb-6 rounded-full"></div>
              
              <h2 className="text-2xl font-semibold mb-4">Bienvenido al Sistema</h2>
              <p className="text-white/90 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
                Consultorio médico integral para el cuidado de tu salud y bienestar
              </p>

              <div className="space-y-3 text-left max-w-xs mx-auto">
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Gestión de turnos eficiente</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Historias clínicas digitales</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-sm">Atención personalizada</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-12 flex flex-col justify-center bg-white">
            <div className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2e75d4] to-[#8ddee1] rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-4H8v-2h4V7h2v4h4v2h-4v4z"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Iniciar Sesión</h3>
              <p className="text-gray-500 text-sm">Ingresa tus credenciales para continuar</p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${fieldErrors.email ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    required
                    className={`block w-full pl-10 pr-3 py-3 border text-gray-700 rounded-lg shadow-sm 
                             placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                             ${fieldErrors.email 
                               ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                               : 'border-gray-300 focus:ring-[#6596d8] focus:border-transparent'}`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setFieldErrors({ ...fieldErrors, email: false });
                    }}
                    placeholder="doctor@eitansalta.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600">Por favor verifica tu correo electrónico</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${fieldErrors.password ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className={`block w-full pl-10 pr-12 py-3 border text-gray-700 rounded-lg shadow-sm 
                             placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
                             ${fieldErrors.password 
                               ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                               : 'border-gray-300 focus:ring-[#6596d8] focus:border-transparent'}`}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setFieldErrors({ ...fieldErrors, password: false });
                    }}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600">Por favor verifica tu contraseña</p>
                )}
              </div>
              
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="group relative w-full py-3 px-4 rounded-lg font-semibold text-base
                         overflow-hidden transition-all duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] p-[2px]">
                  <span className="absolute inset-[2px] rounded-lg bg-white group-hover:bg-transparent transition-all duration-300"></span>
                </span>
                
                <span className="absolute inset-0 bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                
                <span className="relative z-10 bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] bg-clip-text text-transparent group-hover:text-white transition-all duration-300">
                  {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
                </span>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2025 EiTAN Salta - Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}