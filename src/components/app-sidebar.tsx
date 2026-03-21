import { HelpCircle, LogOut, Settings } from 'lucide-react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { NotificationsModal } from '@/components/modals/notifications-modal';
import { PaymentModal } from '@/components/modals/payment-modal';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { navigationList } from '@/constants';
import { ROUTES } from '@/router';
import { logout } from '@/store';
import { resetCall } from '@/store/call';

const data = {
  navMain: navigationList,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSupportClick = () => {
    navigate(ROUTES.SUPPORT);
  };

  const onLogoutClick = () => {
    dispatch(logout());
    dispatch(resetCall());
    navigate(ROUTES.AUTH.ROOT);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent className="pr-2 pb-4">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t pt-4">
        <NotificationsModal />
        <PaymentModal />
        <SidebarMenuButton className="hover:bg-muted/50" tooltip="Logout" onClick={onSupportClick}>
          <Settings />
          <span className="select-none">Settings</span>
        </SidebarMenuButton>
        <SidebarMenuButton className="hover:bg-muted/50" tooltip="Logout" onClick={onSupportClick}>
          <HelpCircle />
          <span className="select-none">Support</span>
        </SidebarMenuButton>
        <SidebarMenuButton className="hover:bg-muted/50" tooltip="Logout" onClick={onLogoutClick}>
          <LogOut color="#f87171" />
          <span className="select-none text-red-400">Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
