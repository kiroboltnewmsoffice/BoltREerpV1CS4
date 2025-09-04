import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../hooks/useTheme';

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      <div className="flex w-full h-full">
        <div className="flex-shrink-0 z-30">
          <Sidebar isCollapsed={sidebarCollapsed} />
        </div>
        
        <div className="flex-1 flex flex-col min-w-0 relative">
          <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;