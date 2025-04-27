import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { AppSidebar } from '@/components/app-sidebar';
import { ChatNotifier } from '@/components/notifier';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { socket } from '@/utils/socket';

export const MainLayout = () => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SidebarProvider>
      <ChatNotifier />
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};
