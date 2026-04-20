type ChatLayoutProps = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
};

export const ChatLayout = ({ sidebar, header, children }: ChatLayoutProps) => (
  <div className="flex">
    {sidebar}

    <div className="flex flex-col w-full">
      {header}
      {children}
    </div>
  </div>
);
