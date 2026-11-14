import React, { useRef, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { TopBar } from './components/TopBar.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { CoursesPage } from './pages/CoursesPage.tsx';
import { LessonDetailPage } from './pages/LessonDetailPage.tsx';
import { PracticePage } from './pages/PracticePage.tsx';
import { QuizPage } from './pages/QuizPage.tsx';
import { RulebookPage } from './pages/RulebookPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { ActivitiesPage } from './pages/ActivitiesPage.tsx';
import { AiTutorPage } from './pages/AiTutorPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { AuthModal } from './pages/AuthPages.tsx';

function MainApp() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeParam, setActiveParam] = useState<string | undefined>(undefined);

  const mainRef = useRef<HTMLElement>(null);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setActiveParam(param);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="h-dvh w-full flex bg-[#F7FAFE] text-slate-800 font-sans selection:bg-sky-100 selection:text-sky-950 overflow-hidden">
      {/* Skip to Main Content for Keyboard / Screen Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-[#1E82E6] focus:text-white focus:text-xs focus:font-bold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Desktop Left Sidebar */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuthModal={handleOpenAuth}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <TopBar
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenAuthModal={handleOpenAuth}
        />

        {/* Dynamic Scrollable Views */}
        <main
          ref={mainRef}
          id="main-content"
          key={currentView + (activeParam || '')}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain gp-page-enter pb-4"
        >
          {currentView === 'home' && (
            <DashboardPage onNavigate={handleNavigate} />
          )}

          {currentView === 'dashboard' && (
            <DashboardPage onNavigate={handleNavigate} />
          )}

          {currentView === 'courses' && (
            <CoursesPage onNavigate={handleNavigate} />
          )}

          {currentView === 'lesson' && activeParam && (
            <LessonDetailPage
              lessonId={activeParam}
              onNavigate={handleNavigate}
              onOpenAuthModal={handleOpenAuth}
            />
          )}

          {currentView === 'practice' && (
            <PracticePage onNavigate={handleNavigate} />
          )}

          {currentView === 'activities' && (
            <ActivitiesPage onNavigate={handleNavigate} />
          )}

          {currentView === 'quizzes' && (
            <QuizPage
              initialLevelId={activeParam}
              onNavigate={handleNavigate}
              onOpenAuthModal={handleOpenAuth}
            />
          )}

          {currentView === 'library' && (
            <RulebookPage />
          )}

          {currentView === 'ai-tutor' && (
            <AiTutorPage
              onNavigate={handleNavigate}
              onOpenAuthModal={handleOpenAuth}
            />
          )}

          {currentView === 'profile' && (
            <ProfilePage
              onNavigate={handleNavigate}
              onOpenAuthModal={handleOpenAuth}
            />
          )}

          {currentView === 'admin' && (
            <AdminDashboardPage onNavigate={handleNavigate} />
          )}
        </main>

        {/* Persistent Bottom Navigation */}
        <BottomNav
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenAuthModal={handleOpenAuth}
        />
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          handleNavigate('home');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
