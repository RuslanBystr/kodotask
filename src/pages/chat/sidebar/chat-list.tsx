import { Loading } from '@/ui-kit/loading/Loading';

type Props<T> = {
  items: T[] | undefined;
  isLoading: boolean;
  renderItem: (item: T) => React.ReactNode;
};

export function ChatList<T>({ items, isLoading, renderItem }: Props<T>) {
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center">
        <Loading size={32} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{items?.map(renderItem)}</>
  );
}
