import {
  Avatar,
  AvatarImage,
} from "@/components/ui/avatar"
import { getEnv } from '@/utils';

const { api } = getEnv();

export function IconCell({row}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any
}) {
  const task = row.original;
  return (
    <div className="flex justify-center">
      <Avatar className="h-6 w-6 rounded-lg">
        <AvatarImage src={`${api}/file/${task?.project?.image}`} alt="file" />
      </Avatar>
    </div>
  )
}
