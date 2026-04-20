export type SidebarChatLayoutProps = {
  header: React.ReactNode;
  list: React.ReactNode;
};

export const SidebarChatLayout = ({ header, list }: SidebarChatLayoutProps) => (
  <div className="flex flex-col h-[100vh] w-min-content pt-2 pr-2 border-r">
    {header}

    <div className="flex flex-col w-14 md:w-[14em] pt-2 bg-muted/10">{list}</div>
  </div>
);
