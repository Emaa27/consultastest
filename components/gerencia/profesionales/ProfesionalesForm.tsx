'use client';

import { useState, useEffect } from 'react';

interface Profesion {
  profesion_id: number;
  nombre: string;
}

interface ProfesionalesFormProps {
  onSuccess: () => void;
}

export default function ProfesionalesFormComponent({ onSuccess }: ProfesionalesFormProps) {
  const [profesiones, setProfesiones] = useState<Profesion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    apellidoUsuario: '',
    emailUsuario: '',
    telefonoUsuario: '',
    dniUsuario: '',
    contrasena: '',
    matricula: '',
    profesion_id: '',
    rol_id: '2', // Default: Profesional
  });

  useEffect(() => {
    const fetchProfesiones = async () => {
      try {
        const res = await fetch('/api/gerencia/profesiones');
        if (res.ok) {
          const data = await res.json();
          setProfesiones(data);
        }
      } catch (err) {
        console.error('Error fetching profesiones:', err);
      }
    };
    fetchProfesiones();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.nombreUsuario.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.apellidoUsuario.trim()) {
      setError('El apellido es requerido');
      return false;
    }
    if (!formData.emailUsuario.trim() || !/\S+@\S+\.\S+/.test(formData.emailUsuario)) {
      setError('Email inválido');
      return false;
    }
    if (!formData.contrasena || formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (!formData.profesion_id) {
      setError('Debe seleccionar una profesión');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/gerencia/profesionales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: {
            nombre: formData.nombreUsuario.trim(),
            apellido: formData.apellidoUsuario.trim(),
            email: formData.emailUsuario.trim().toLowerCase(),
            telefono: formData.telefonoUsuario.trim() || null,
            dni: formData.dniUsuario.trim() || null,
            contrasena: formData.contrasena,
            rol_id: parseInt(formData.rol_id),
          },
          profesional: {
            matricula: formData.matricula.trim() || null,
            profesion_id: parseInt(formData.profesion_id),
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear profesional');
      }

      // Resetear formulario
      setFormData({
        nombreUsuario: '',
        apellidoUsuario: '',
        emailUsuario: '',
        telefonoUsuario: '',
        dniUsuario: '',
        contrasena: '',
        matricula: '',
        profesion_id: '',
        rol_id: '2',
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nombreUsuario"
            placeholder="Ej: Juan"
            value={formData.nombreUsuario}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="apellidoUsuario"
            placeholder="Ej: Pérez"
            value={formData.apellidoUsuario}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="emailUsuario"
            placeholder="ejemplo@correo.com"
            value={formData.emailUsuario}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            DNI
          </label>
          <input
            type="text"
            name="dniUsuario"
            placeholder="12345678"
            value={formData.dniUsuario}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            name="telefonoUsuario"
            placeholder="+54 11 1234-5678"
            value={formData.telefonoUsuario}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="contrasena"
            placeholder="Mínimo 6 caracteres"
            value={formData.contrasena}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matrícula
          </label>
          <input
            type="text"
            name="matricula"
            placeholder="MP 12345"
            value={formData.matricula}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profesión <span className="text-red-500">*</span>
          </label>
          <select
            name="profesion_id"
            value={formData.profesion_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white"
          >
            <option value="">Seleccionar profesión</option>
            {profesiones.map(prof => (
              <option key={prof.profesion_id} value={prof.profesion_id}>
                {prof.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#16a34a] to-[#86efac] text-white py-2.5 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creando...' : 'Crear Profesional'}
      </button>
    </form>
  );
}
