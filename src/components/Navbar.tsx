import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { BookOpen, User as UserIcon, LogOut, ShieldAlert, LayoutDashboard, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
}

export function Navbar({ currentView, onNavigate, onOpenAuthModal }: NavbarProps) {
  const { user, logout, quickLogin } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <BookOpen className="w-5 h-5" />
              </span>
              <span>GrammarPath</span>
            </button>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                currentView === 'home' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                currentView === 'courses' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => onNavigate('practice')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                currentView === 'practice' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''
              }`}
            >
              Practice
            </button>
            <button
              onClick={() => onNavigate('quizzes')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                currentView === 'quizzes' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''
              }`}
            >
              Quizzes
            </button>
            {user && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                  currentView === 'dashboard' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''
                }`}
              >
                Dashboard
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                  currentView === 'admin' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''
                }`}
              >
                Admin
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action or User profile button */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <span className="max-w-[120px] truncate">{user.fullName.split(' ')[0]}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-bn">সাইন ইন করা হয়েছে</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {user.role === 'admin' ? 'Administrator' : 'Student (শিক্ষার্থী)'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      <span>Learning Dashboard</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                        onNavigate('home');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out (লগআউট)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Start Free
                </button>
              </div>
            )}

            {/* Mobile hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('home');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('courses');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
            >
              Courses
            </button>
            <button
              onClick={() => {
                onNavigate('practice');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
            >
              Practice
            </button>
            <button
              onClick={() => {
                onNavigate('quizzes');
                setIsMobileMenuOpen(false);
              }}
              className="px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
            >
              Quizzes
            </button>
            {user && (
              <button
                onClick={() => {
                  onNavigate('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                Dashboard
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
              >
                Admin Console
              </button>
            )}
            {!user && (
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    quickLogin('student');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-1.5 text-xs text-blue-700 bg-blue-50 rounded text-center"
                >
                  Quick Student Demo
                </button>
                <button
                  onClick={() => {
                    quickLogin('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 py-1.5 text-xs text-purple-700 bg-purple-50 rounded text-center"
                >
                  Quick Admin Demo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
