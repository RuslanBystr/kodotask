import { LogOut } from 'lucide-react';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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

const data = {
  navMain: navigationList,
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogoutClick = () => {
    dispatch(logout());
    navigate(ROUTES.AUTH.ROOT);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <PaymentModal />
        <SidebarMenuButton className="hover:bg-muted/50" tooltip="Logout" onClick={onLogoutClick}>
          <LogOut />
          <span className="select-none">Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
