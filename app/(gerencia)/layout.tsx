import Navbar from '@/components/NavbarGerencia';

export default function RecepcionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </>
  );
}