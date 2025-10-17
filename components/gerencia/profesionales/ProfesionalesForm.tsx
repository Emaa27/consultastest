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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/gerencia/profesionales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: {
            nombre: formData.nombreUsuario,
            apellido: formData.apellidoUsuario,
            email: formData.emailUsuario,
            telefono: formData.telefonoUsuario,
            contrasena: formData.contrasena,
            rol_id: parseInt(formData.rol_id),
          },
          profesional: {
            matricula: formData.matricula,
            profesion_id: parseInt(formData.profesion_id),
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear profesional');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Agregar Profesional</h2>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        name="nombreUsuario"
        placeholder="Nombre"
        value={formData.nombreUsuario}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="text"
        name="apellidoUsuario"
        placeholder="Apellido"
        value={formData.apellidoUsuario}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="email"
        name="emailUsuario"
        placeholder="Email"
        value={formData.emailUsuario}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="tel"
        name="telefonoUsuario"
        placeholder="Teléfono"
        value={formData.telefonoUsuario}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="password"
        name="contrasena"
        placeholder="Contraseña"
        value={formData.contrasena}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <input
        type="text"
        name="matricula"
        placeholder="Matrícula"
        value={formData.matricula}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <select
        name="profesion_id"
        value={formData.profesion_id}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      >
        <option value="">Seleccionar profesión</option>
        {profesiones.map(prof => (
          <option key={prof.profesion_id} value={prof.profesion_id}>
            {prof.nombre}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#16a34a] to-[#86efac] text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear Profesional'}
      </button>
    </form>
  );
}
