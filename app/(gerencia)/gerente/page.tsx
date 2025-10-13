// app/gerencia/en-trabajo/page.tsx
export default function EnTrabajoPage() {
  return (
    <section className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen w-full grid place-items-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        {/* Icono */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 7h18" />
            <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
            <rect x="3" y="7" width="18" height="13" rx="2" ry="2" />
            <path d="M8 14h8" />
          </svg>
        </div>

        {/* Texto */}
        <h1 className="text-2xl font-semibold text-gray-900">Sección en trabajo</h1>
        <p className="mt-2 text-gray-600">
          Estamos preparando esta pantalla. Pronto vas a poder verla funcionando.
        </p>

        {/* Línea de estado sutil (opcional visual) */}
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full w-1/2 bg-gradient-to-r from-[#16a34a] to-[#86efac]" />
        </div>

        <p className="mt-2 text-xs text-gray-500">En progreso</p>
      </div>
    </section>
  );
}
