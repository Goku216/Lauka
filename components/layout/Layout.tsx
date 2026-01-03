"use client";
import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { LoginForm } from '../login-form';
import { SignupForm } from '../signup-form';
import { X } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [modal, setModal] = useState<'none' | 'login' | 'signup'>('none');
  return (
    <div className="flex flex-col min-h-screen">
      <Header setModal={setModal} />
      <main className="flex-1">{children}</main>
        {modal !== 'none' && (
                    <div className="fixed inset-0 z-100000 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setModal('none')}
                      />
            
                      <div
                        role="dialog"
                        aria-modal="true"
                        className="relative w-full max-w-md mx-4 z-100001"
                      >
                        <div className="p-2">
                          {modal === 'login' ? (
                            <LoginForm 
                              onSwitch={() => setModal('signup')} 
                              onLoginSuccess={() => setModal('none')}
                            />
                          ) : (
                            <SignupForm onSwitch={() => setModal('login')} />
                          )}
                        </div>
            
                        <button
                          aria-label="Close modal"
                          onClick={() => setModal('none')}
                          className="absolute -top-2 -right-2 p-2 rounded-full bg-card shadow-md hover:opacity-90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
      <Footer />
    </div>
  );
}
