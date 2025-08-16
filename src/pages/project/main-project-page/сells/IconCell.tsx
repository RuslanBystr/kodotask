import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { IProjectResponse } from '@/types/responses/IProjectResponse';
import { getEnv } from '@/utils';

const { api } = getEnv();

export function IconCell({
  row,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
}) {
  const project: IProjectResponse = row.original;
  return (
    <div className="flex justify-center">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={`${api}/file/${project?.image}`} alt="file" />
      </Avatar>
    </div>
  );
}
