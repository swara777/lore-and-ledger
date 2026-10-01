'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LibraryProvider } from '@/context/LibraryContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import NewAcquisitionModal from '@/components/NewAcquisitionModal';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [isAcquisitionOpen, setIsAcquisitionOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === '/login' || pathname === '/';

  return (
    <LibraryProvider>
      <div className="min-h-screen bg-background text-on-surface">
        {/* Left Side Navigation Spine (Hidden on Login) */}
        {!isLoginPage && <Sidebar />}

        {/* Top Header Bar (Hidden on Login) */}
        {!isLoginPage && <Header onOpenNewAcquisition={() => setIsAcquisitionOpen(true)} />}

        {/* Main Content Area */}
        <div className={!isLoginPage ? 'pl-72' : 'w-full'}>
          <main className={`relative ${!isLoginPage ? 'pt-20' : ''} w-full min-h-screen bg-background`}>
            {children}
          </main>
        </div>

        {/* Global Toast */}
        <Toast />

        {/* Global New Acquisition Modal */}
        {!isLoginPage && (
          <NewAcquisitionModal
            isOpen={isAcquisitionOpen}
            onClose={() => setIsAcquisitionOpen(false)}
          />
        )}
      </div>
    </LibraryProvider>
  );
}
