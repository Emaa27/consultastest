'use client';

import React, { useEffect, useMemo, useState } from 'react';

/* ---------------- Icons ---------------- */
const UserPlus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="6" x2="20" y2="12"></line>
    <line x1="17" y1="9" x2="23" y2="9"></line>
  </svg>
);

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const Phone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const CreditCard = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22,4 12,14.01 9,11.01"></polyline>
  </svg>
);

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const Filter = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const ArrowUpDown = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="m21 16-4 4-4-4"></path>
    <path d="M17 20V4"></path>
    <path d="m3 8 4-4 4 4"></path>
    <path d="M7 4v16"></path>
  </svg>
);

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

/* ---------------- Date helpers ---------------- */
const HOY = new Date();
const MAX_YEAR = HOY.getFullYear();
const MIN_YEAR = MAX_YEAR - 120;

function diasEnMes(year: number, month1a12: number) {
  return new Date(year, month1a12, 0).getDate();
}

function toSlashedDDMMYYYY(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseDDMMYYYY(raw: string): { iso?: string; error?: string } {
  const m = raw.match(/^(\d{2})[\/\s](\d{2})[\/\s](\d{4})$/);
  if (!m) return {};
  const dd = Number(m[1]), mm = Number(m[2]), yy = Number(m[3]);
  if (yy < MIN_YEAR || yy > MAX_YEAR || mm < 1 || mm > 12) return { error: 'Fecha inválida' };
  const maxDia = diasEnMes(yy, mm);
  if (dd < 1 || dd > maxDia) return { error: 'Fecha inválida' };
  const date = new Date(Date.UTC(yy, mm - 1, dd));
  if (date > HOY) return { error: 'No puede ser futura' };
  return { iso: `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}` };
}

/* ---------------- Validation helpers ---------------- */
function validateNombre(nombre: string): string {
  if (!nombre.trim()) return 'El nombre es requerido';
  if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(nombre)) return 'Solo se permiten letras';
  if (nombre.trim().length < 2) return 'Mínimo 2 caracteres';
  return '';
}

function validateApellido(apellido: string): string {
  if (!apellido.trim()) return 'El apellido es requerido';
  if (!/^[a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]+$/.test(apellido)) return 'Solo se permiten letras';
  if (apellido.trim().length < 2) return 'Mínimo 2 caracteres';
  return '';
}

function validateDNI(dni: string): string {
  if (!dni.trim()) return 'El DNI es requerido';
  if (!/^\d{8}$/.test(dni)) return 'Debe tener exactamente 8 dígitos';
  return '';
}

function validateTelefono(telefono: string): string {
  if (!telefono.trim()) return 'El teléfono es requerido';
  if (!/^\d{10}$/.test(telefono)) return 'Debe tener 10 dígitos';
  return '';
}

function validateEmail(email: string): string {
  if (!email.trim()) return 'El email es requerido';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Email inválido';
  return '';
}

/* ---------------- Types ---------------- */
type ObraSocial = {
  obra_social_id: number;
  nombre: string;
};

type Paciente = {
  paciente_id?: number;
  nombre: string;
  apellido: string;
  documento: string;
  email?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  fecha_registro?: string;
  genero?: string;
  obra_social_id?: number | null;
  obras_sociales?: { nombre: string };
};

type ValidationErrors = {
  nombre?: string;
  apellido?: string;
  documento?: string;
  telefono?: string;
  email?: string;
};

const ITEMS_PER_PAGE = 10;

/* ---------------- Component ---------------- */
export default function GestionPacientesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [obras, setObras] = useState<ObraSocial[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedObraSocial, setSelectedObraSocial] = useState<string>('todos');
  const [sortOrder, setSortOrder] = useState<'recientes' | 'antiguos'>('recientes');
  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState<Paciente>({
    nombre: '',
    apellido: '',
    documento: '',
    email: '',
    telefono: '',
    genero: '',
    fecha_nacimiento: '',
    obra_social_id: null,
  });

  const [dobRaw, setDobRaw] = useState('');
  const [dobError, setDobError] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    cargarPacientes();
    cargarObrasSociales();
  }, []);

  const obrasSinParticular = useMemo(
    () => obras.filter(o => (o.nombre || '').toLowerCase() !== 'particular'),
    [obras]
  );

  const cargarPacientes = async () => {
    setLoadingPacientes(true);
    try {
      const res = await fetch('/api/pacientes');
      if (!res.ok) throw new Error('Error al cargar pacientes');
      const data = await res.json();
      setPacientes(data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    } finally {
      setLoadingPacientes(false);
    }
  };

  const cargarObrasSociales = async () => {
    try {
      const res = await fetch('/api/obras_sociales');
      if (!res.ok) throw new Error('Error al cargar obras sociales');
      const json = await res.json();
      const items: ObraSocial[] = Array.isArray(json) ? json : (json.items ?? []);
      setObras(items);
    } catch (error) {
      console.error('Error al cargar obras sociales:', error);
    }
  };

  const pacientesFiltradosYOrdenados = useMemo(() => {
    let filtrados = [...pacientes];

    if (searchTerm) {
      const termino = searchTerm.toLowerCase();
      filtrados = filtrados.filter((p) =>
        p.documento.includes(termino) ||
        p.nombre.toLowerCase().includes(termino) ||
        p.apellido.toLowerCase().includes(termino)
      );
    }

    if (selectedObraSocial !== 'todos') {
      if (selectedObraSocial === 'particular') {
        filtrados = filtrados.filter(
          (p) => !p.obra_social_id || p.obras_sociales?.nombre?.toLowerCase() === 'particular'
        );
      } else {
        filtrados = filtrados.filter(
          (p) => p.obra_social_id?.toString() === selectedObraSocial
        );
      }
    }

    filtrados.sort((a, b) => {
      const dateA = a.fecha_registro ? new Date(a.fecha_registro).getTime() : 0;
      const dateB = b.fecha_registro ? new Date(b.fecha_registro).getTime() : 0;
      return sortOrder === 'recientes' ? dateB - dateA : dateA - dateB;
    });

    return filtrados;
  }, [pacientes, searchTerm, selectedObraSocial, sortOrder]);

  const totalPages = Math.ceil(pacientesFiltradosYOrdenados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pacientesPaginados = pacientesFiltradosYOrdenados.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedObraSocial, sortOrder]);

  const handleBlur = (field: keyof ValidationErrors) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof ValidationErrors) => {
    let error = '';
    switch (field) {
      case 'nombre':
        error = validateNombre(form.nombre);
        break;
      case 'apellido':
        error = validateApellido(form.apellido);
        break;
      case 'documento':
        error = validateDNI(form.documento);
        break;
      case 'telefono':
        error = validateTelefono(form.telefono || '');
        break;
      case 'email':
        error = validateEmail(form.email || '');
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const validateAllFields = (): boolean => {
    const newErrors: ValidationErrors = {
      nombre: validateNombre(form.nombre),
      apellido: validateApellido(form.apellido),
      documento: validateDNI(form.documento),
      telefono: validateTelefono(form.telefono || ''),
      email: validateEmail(form.email || ''),
    };
    setErrors(newErrors);
    setTouched({
      nombre: true,
      apellido: true,
      documento: true,
      telefono: true,
      email: true,
    });
    return Object.values(newErrors).every(error => !error);
  };

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, '');
    setForm(f => ({ ...f, nombre: value }));
    if (touched.nombre) validateField('nombre');
  };

  const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, '');
    setForm(f => ({ ...f, apellido: value }));
    if (touched.apellido) validateField('apellido');
  };

  const handleDNIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
    setForm(f => ({ ...f, documento: value }));
    if (touched.documento) validateField('documento');
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm(f => ({ ...f, telefono: value }));
    if (touched.telefono) validateField('telefono');
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, email: e.target.value }));
    if (touched.email) validateField('email');
  };

  const handleGeneroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, genero: e.target.value }));
  };

  const handleObraSocialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setForm(f => ({ ...f, obra_social_id: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields()) {
      alert('Por favor corrige los errores en el formulario');
      return;
    }

    if (dobRaw && dobError) return;

    const documentoExiste = pacientes.some(
      p => p.documento === form.documento.trim()
    );

    if (documentoExiste) {
      alert('Ya existe un paciente con este documento');
      return;
    }

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const payload = {
        ...form,
        documento: form.documento.trim(),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email?.trim() || null,
        telefono: form.telefono?.trim() || null,
        fecha_nacimiento: form.fecha_nacimiento || null,
        obra_social_id: form.obra_social_id ?? null,
      };

      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'No se pudo guardar');

      setSuccessMessage('Paciente registrado correctamente');
      await cargarPacientes();

      setForm({
        nombre: '',
        apellido: '',
        documento: '',
        email: '',
        telefono: '',
        genero: '',
        fecha_nacimiento: '',
        obra_social_id: null,
      });
      setDobRaw('');
      setDobError('');
      setErrors({});
      setTouched({});

      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage('');
      }, 1500);
    } catch (err: any) {
      alert('Error: ' + (err?.message ?? 'Error inesperado'));
    } finally {
      setIsLoading(false);
    }
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const upperFirst = (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '');

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Pacientes</h1>
        <p className="text-gray-600">Administra la información de los pacientes del consultorio</p>
      </div>

      <div className="space-y-4 mb-6">
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="px-6 py-3 bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] text-white rounded-lg 
            hover:from-[#2e75d4] hover:to-[#8ddee1] shadow-lg transform transition-all duration-200 
            hover:scale-[1.02] active:scale-[0.98] font-semibold flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus className="w-5 h-5" />
            Registrar Nuevo Paciente
          </button>

        {/* Filtros y buscador */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Buscador */}
          <div className="relative w-full sm:w-83">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por DNI, nombre o apellido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#6596d8] focus:border-transparent 
                        transition-all duration-200"
            />
          </div>
      </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Obra social:</label>
            </div>
            <select
              value={selectedObraSocial}
              onChange={(e) => setSelectedObraSocial(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            >
              <option value="todos">Todas</option>
              <option value="particular">Particular</option>
              {obrasSinParticular.map(obra => (
                <option key={obra.obra_social_id} value={obra.obra_social_id.toString()}>
                  {obra.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Ordenar:</label>
            </div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'recientes' | 'antiguos')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            >
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
        {loadingPacientes ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6596d8]"></div>
          </div>
        ) : pacientesPaginados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <User className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">
              {pacientesFiltradosYOrdenados.length === 0
                ? searchTerm || selectedObraSocial !== 'todos'
                  ? 'No se encontraron pacientes con estos filtros'
                  : 'No hay pacientes registrados'
                : 'No hay pacientes en esta página'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-sky-200 to-gray-100 border-b border-[#6596d8]/20 ">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Documento</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Apellido</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Teléfono</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">F. Nacimiento</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Obra Social</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pacientesPaginados.map((paciente, index) => (
                  <tr key={paciente.paciente_id || index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paciente.documento}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{upperFirst(paciente.apellido)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{upperFirst(paciente.nombre)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{paciente.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{paciente.telefono || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatearFecha(paciente.fecha_nacimiento)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {paciente.obras_sociales?.nombre ?? '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <a
                        href={`/pacientes/${paciente.paciente_id}/historia`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-sky-100 text-gray-600 
                                   rounded-lg hover:bg-sky-200 transition-colors text-sm font-medium"
                        title="Ver Historia Clínica"
                      >
                        <FileText className="w-4 h-4" />
                        Detalle 
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loadingPacientes && pacientesFiltradosYOrdenados.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-600">
              Mostrando {startIndex + 1}-{Math.min(endIndex, pacientesFiltradosYOrdenados.length)} de {pacientesFiltradosYOrdenados.length} pacientes
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => goToPage(pageNumber)}
                        className={`px-3 py-1 rounded-lg font-medium transition-colors ${currentPage === pageNumber ? 'bg-orange-400 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-[#6596d8]/5 to-[#b5e4e6]/5 rounded-lg">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                Registrar Nuevo Paciente
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#6596d8]" />
                  Datos Personales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="w-4 h-4 text-orange-400" />
                      Documento *
                    </label>
                    <input
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                                 focus:ring-orange-400 focus:border-transparent transition-all duration-200
                                 ${touched.documento && errors.documento ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="8 dígitos sin puntos"
                      value={form.documento}
                      onChange={handleDNIChange}
                      onBlur={() => handleBlur('documento')}
                      maxLength={8}
                      required
                    />
                    {touched.documento && errors.documento && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.documento}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      Fecha de Nacimiento
                    </label>
                    <input
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                                  focus:ring-[#6596d8] focus:border-transparent transition-all duration-200
                                  ${dobError ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="DD/MM/AAAA"
                      inputMode="numeric"
                      value={dobRaw}
                      onChange={(e) => {
                        const v = toSlashedDDMMYYYY(e.target.value);
                        setDobRaw(v);
                        const { iso, error } = parseDDMMYYYY(v);
                        setDobError(error ?? '');
                        setForm((f) => ({ ...f, fecha_nacimiento: iso ?? '' }));
                      }}
                      onBlur={() => {
                        if (dobRaw && !parseDDMMYYYY(dobRaw).iso) setDobError('Fecha inválida');
                      }}
                    />
                    {dobError && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {dobError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                    <input
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                                 focus:ring-orange-400 focus:border-transparent transition-all duration-200
                                 ${touched.nombre && errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Solo letras"
                      value={form.nombre}
                      onChange={handleNombreChange}
                      onBlur={() => handleBlur('nombre')}
                      required
                    />
                    {touched.nombre && errors.nombre && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.nombre}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                    <input
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                                 focus:ring-orange-400 focus:border-transparent transition-all duration-200
                                 ${touched.apellido && errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Solo letras"
                      value={form.apellido}
                      onChange={handleApellidoChange}
                      onBlur={() => handleBlur('apellido')}
                      required
                    />
                    {touched.apellido && errors.apellido && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.apellido}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    Género *
                  </label>
                  <div className="flex gap-8 items-center p-3 border border-gray-300 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="genero"
                        value="Hombre"
                        checked={form.genero === 'Hombre'}
                        onChange={handleGeneroChange}
                        required
                        className="text-orange-400 focus:ring-orange-400 cursor-pointer"
                      />
                      Hombre
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="genero"
                        value="Mujer"
                        checked={form.genero === 'Mujer'}
                        onChange={handleGeneroChange}
                        required
                        className="text-orange-400 focus:ring-orange-400 cursor-pointer"
                      />
                      Mujer
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="genero"
                        value="otro"
                        checked={form.genero === 'otro'}
                        onChange={handleGeneroChange}
                        required
                        className="text-orange-400 focus:ring-orange-400 cursor-pointer"
                      />
                      Otro
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#6596d8]" />
                  Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 text-orange-400" />
                      Email *
                    </label>
                    <input
                      type="email"
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                                 focus:ring-orange-400 focus:border-transparent transition-all duration-200
                                 ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="correo@ejemplo.com"
                      value={form.email}
                      onChange={handleEmailChange}
                      onBlur={() => handleBlur('email')}
                      required
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 text-orange-400" />
                      Teléfono *
                    </label>
                    <input
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 
                                 focus:ring-orange-400 focus:border-transparent transition-all duration-200
                                 ${touched.telefono && errors.telefono ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="10 dígitos (ej: 3815551234)"
                      value={form.telefono}
                      onChange={handleTelefonoChange}
                      onBlur={() => handleBlur('telefono')}
                      inputMode="numeric"
                      maxLength={10}
                      required
                    />
                    {touched.telefono && errors.telefono && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.telefono}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#6596d8]" />
                  Cobertura Médica 
                </h3>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">Obra Social</label>
                  <select
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 
                               focus:ring-[#6596d8] focus:border-transparent transition-all duration-200
                               appearance-none bg-white"
                    value={form.obra_social_id ?? ''}
                    onChange={handleObraSocialChange}
                  >
                    <option value="">Seleccione una obra social</option>
                    {obras.map((o) => (
                      <option key={o.obra_social_id} value={o.obra_social_id}>
                        {o.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <p className="text-sm font-medium">{successMessage}</p>
                </div>
              )}

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-xs text-orange-700">* Los campos marcados con asterisco son obligatorios</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                             disabled:opacity-50 font-semibold transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || (!!dobRaw && !!dobError)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#6596d8] to-[#b5e4e6] text-white 
                             rounded-lg hover:from-[#2e75d4] hover:to-[#8ddee1] disabled:opacity-50 
                             disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 
                             transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Registrar Paciente
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}