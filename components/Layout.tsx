
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-0 md:p-6 relative overflow-hidden">
      {/* Background decorative orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full min-h-screen md:min-h-0 md:rounded-3xl md:my-4 glass md:border md:border-white/10 flex flex-col relative md:shadow-2xl">
        <main className="flex-1 flex flex-col p-5 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
