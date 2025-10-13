'use client';

import React from 'react';
import NavbarGerente from './NavbarGerencia';

export default function SidebarLayoutGerente({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <NavbarGerente />
      {/* header fijo en mobile */}
      <div className="flex-1 overflow-auto pt-14 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
