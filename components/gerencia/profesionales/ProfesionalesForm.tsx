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
    // Validar nombre (solo letras y espacios)
    if (!formData.nombreUsuario.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombreUsuario.trim())) {
      setError('El nombre solo puede contener letras');
      return false;
    }

    // Validar apellido (solo letras y espacios)
    if (!formData.apellidoUsuario.trim()) {
      setError('El apellido es requerido');
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellidoUsuario.trim())) {
      setError('El apellido solo puede contener letras');
      return false;
    }

    // Validar email
    if (!formData.emailUsuario.trim() || !/\S+@\S+\.\S+/.test(formData.emailUsuario)) {
      setError('Email inválido');
      return false;
    }

    // Validar DNI (solo números, 7-8 dígitos)
    if (!formData.dniUsuario.trim()) {
      setError('El DNI es requerido');
      return false;
    }
    if (!/^\d{7,8}$/.test(formData.dniUsuario.trim())) {
      setError('El DNI debe contener solo números (7-8 dígitos)');
      return false;
    }

    // Validar teléfono (opcional, pero si se ingresa debe ser válido)
    if (formData.telefonoUsuario.trim() && !/^[+\d\s\-()]+$/.test(formData.telefonoUsuario.trim())) {
      setError('El teléfono solo puede contener números, espacios, +, - y paréntesis');
      return false;
    }

    // Validar contraseña
    if (!formData.contrasena) {
      setError('La contraseña es requerida');
      return false;
    }

    // Validar matrícula (opcional, letras y números)
    if (formData.matricula.trim() && !/^[a-zA-Z0-9\s\-]+$/.test(formData.matricula.trim())) {
      setError('La matrícula solo puede contener letras, números, espacios y guiones');
      return false;
    }

    // Validar profesión
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
            dni: formData.dniUsuario.trim(),
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
            pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
            title="Solo se permiten letras"
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
            pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
            title="Solo se permiten letras"
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
            DNI <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="dniUsuario"
            placeholder="12345678"
            value={formData.dniUsuario}
            onChange={handleChange}
            required
            pattern="\d{7,8}"
            maxLength={8}
            title="Solo números, 7-8 dígitos"
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
            pattern="[+\d\s\-()]+"
            title="Solo números, espacios, +, - y paréntesis"
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
            placeholder="Ingrese una contraseña"
            value={formData.contrasena}
            onChange={handleChange}
            required
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
            pattern="[a-zA-Z0-9\s\-]+"
            title="Solo letras, números, espacios y guiones"
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
