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

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const hasChildren = !!item.items?.length;
          const isActiveItem = location.pathname === item.url || location.pathname.startsWith(`${item.url}/`);

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActiveItem && hasChildren}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {hasChildren ? (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={clsx(
                        'py-4 rounded-none',
                        'bg-[#4A6070]/60 hover:bg-[--main-button]',
                        'data-[active=true]:bg-[--main-button]',
                        'group-data-[state=open]/collapsible:bg-[--main-button]/60',
                      )}
                      data-active={isActiveItem}
                    >
                      {item.icon && <item.icon />}
                      <span className="select-none">{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => {
                      navigate(item.url);
                      setOpenMobile(false);
                    }}
                    className={clsx(
                      'py-4 rounded-none transition-all duration-100 ease-in-out transform',
                      'bg-[#172F45]/20 hover:bg-[#425D68] border rounded-md',
                      'data-[active=true]:bg-[#425D68]',
                    )}
                    data-active={isActiveItem}
                  >
                    {item.icon && <item.icon />}
                    <span className="select-none">{item.title}</span>
                  </SidebarMenuButton>
                )}

                {hasChildren && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items!.map((sub) => {
                        const isActiveSub =
                          location.pathname === sub.url || location.pathname.startsWith(`${sub.url}/`);

                        return (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton
                              onClick={() => {
                                navigate(sub.url);
                                setOpenMobile(false);
                              }}
                              className={clsx(
                                'cursor-pointer hover:bg-[--main-button]/20',
                                'data-[active=true]:bg-[--main-button]/30',
                              )}
                              data-active={isActiveSub}
                            >
                              {sub.icon && <sub.icon />}
                              <span>{sub.title}</span>
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
