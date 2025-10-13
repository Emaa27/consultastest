'use client';

import { useState } from 'react';
import {
  User,
  UserPlus,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Shield,
  X,
  AlertCircle,
  CheckCircle,
} from './Icons'; // 👈 importa tus íconos desde donde los tengas

type Paciente = {
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  telefono: string;
  genero?: string;
  fecha_nacimiento?: string;
  obra_social_id?: number | null;
};

type ObraSocial = {
  obra_social_id: number;
  nombre: string;
};

type Props = {
  onClose: () => void;
  onSaved: () => void;
  obras: ObraSocial[];
};

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

export default function PacienteForm({ onClose, onSaved, obras }: Props) {
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
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const onChange =
    (name: keyof Paciente) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let value: any = e.target.value;
      if (name === 'obra_social_id') value = value ? Number(value) : null;
      setForm((f) => ({ ...f, [name]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dobRaw && dobError) return;
    setIsLoading(true);
    setSuccessMessage('');

    try {
      const payload = {
        ...form,
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
      onSaved();

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

      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1500);
    } catch (err: any) {
      alert('Error: ' + (err?.message ?? 'Error inesperado'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            Registrar Nuevo Paciente
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos personales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-400" />
              Datos Personales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-orange-400" /> Documento *
                </label>
                <input
                  className="w-full p-3 border rounded-lg"
                  placeholder="DNI sin puntos"
                  value={form.documento}
                  onChange={onChange('documento')}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-orange-400" /> Fecha Nacimiento
                </label>
                <input
                  className={`w-full p-3 border rounded-lg ${dobError ? 'border-red-500' : 'border-gray-300'}`}
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
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input className="w-full p-3 border rounded-lg" value={form.nombre} onChange={onChange('nombre')} required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Apellido *</label>
                <input className="w-full p-3 border rounded-lg" value={form.apellido} onChange={onChange('apellido')} required />
              </div>
            </div>

            {/* Género */}
            <div className="mt-3">
              <label className="block text-sm font-medium mb-2">Género *</label>
              <div className="flex gap-6">
                {['Hombre', 'Mujer', 'Otro'].map((g) => (
                  <label key={g} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="genero"
                      value={g}
                      checked={form.genero === g}
                      onChange={onChange('genero')}
                      required
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-400" />
              Información de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Mail className="w-4 h-4 text-orange-400" /> Email *
                </label>
                <input type="email" className="w-full p-3 border rounded-lg" value={form.email} onChange={onChange('email')} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Phone className="w-4 h-4 text-orange-400" /> Teléfono *
                </label>
                <input className="w-full p-3 border rounded-lg" value={form.telefono} onChange={onChange('telefono')} required />
              </div>
            </div>
          </div>

          {/* Obra Social */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-400" />
              Cobertura Médica
            </h3>
            <select className="w-full p-3 border rounded-lg" value={form.obra_social_id ?? ''} onChange={onChange('obra_social_id')}>
              <option value="">Seleccione una obra social</option>
              {obras.map((o) => (
                <option key={o.obra_social_id} value={o.obra_social_id}>
                  {o.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 px-4 py-3 bg-gray-200 rounded-lg">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || (!!dobRaw && !!dobError)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-lg"
            >
              {isLoading ? 'Guardando...' : 'Registrar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
