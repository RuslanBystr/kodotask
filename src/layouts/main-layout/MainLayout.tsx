import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { AppSidebar } from '@/components/app-sidebar';
import { CallSocketBridge } from '@/components/call/call-socket-bridge';
import { IncomingCallModal } from '@/components/modals/incoming-call-modal';
import { ChatNotifier } from '@/components/notifier';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useUserConnection } from '@/hooks/useUserConnection';
import { selectAuthenticatedUserSelector } from '@/store';
import { socket } from '@/utils/socket';

import { GlobalCallLayer } from '../../components/call/global-call.layer';

export const MainLayout = () => {
  const userData = useSelector(selectAuthenticatedUserSelector);
  const userId = userData?.id;

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
  useUserConnection({ userId });

  return (
    <SidebarProvider>
      <ChatNotifier />
      <CallSocketBridge />
      <IncomingCallModal />
      <GlobalCallLayer />
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};
