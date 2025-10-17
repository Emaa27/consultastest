'use client';

import { useState } from 'react';

interface ProfesionesFormProps {
  onSuccess: () => void;
}

export default function ProfesionesFormComponent({ onSuccess }: ProfesionesFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nombre, setNombre] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/gerencia/profesiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Error al crear profesión');
      }

      setNombre('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Nueva Profesión</h2>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <input
        type="text"
        placeholder="Nombre de la profesión (ej: Cardiología, Pediatría)"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#16a34a] to-[#86efac] text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? 'Creando...' : 'Crear Profesión'}
      </button>
    </form>
  );
}