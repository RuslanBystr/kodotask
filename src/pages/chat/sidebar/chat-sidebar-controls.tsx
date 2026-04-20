import { Input } from '@/components/ui/input';

export const ChatSidebarControls = ({
  onSearch,
  children,
}: {
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}) => (
  <>
    <Input className="md:w-full p-2 mb-2 text-[10px]" placeholder="Search" onChange={onSearch} />
    {children}
  </>
);
