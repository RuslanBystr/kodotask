import { clsx } from 'clsx';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const menuButtonHandler = (item: any) => {
    navigate(item.url);
    if (!item.items) {
      setOpenMobile(false);
    }
  };

  const menuSubButtonHandler = (url: string) => {
    navigate(url);
    setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActiveItem = location.pathname.startsWith(item.url);
          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => menuButtonHandler(item)}
                    className={clsx(
                      'py-4 hover:bg-gray border-gray-600 border-2 transition-all duration-200 ease-in-out transform hover:bg-gray-800',
                      {
                        'font-bold bg-gray-700 border-gray-400': isActiveItem,
                      },
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {item.items && (
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isActiveSubItem = location.pathname === `/${subItem.url}`;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              className={clsx('cursor-pointer hover:bg-muted/50 shadow', {
                                'font-bold bg-muted/100 border-b-2 shadow': isActiveSubItem,
                              })}
                              onClick={() => menuSubButtonHandler(subItem.url)}
                            >
                              {subItem?.icon && <subItem.icon />}
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
