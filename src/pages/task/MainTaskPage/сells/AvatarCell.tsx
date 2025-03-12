import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { getEnv } from '@/utils';

const { api } = getEnv();

export function AvatarCell({row}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any
}) {
  const task = row.original;
  return (
    <Avatar className="w-6 h-6">
      <AvatarImage src={`${api}/file/${task?.assignedUser?.avatar}`} alt="file" />
      <AvatarFallback>AA</AvatarFallback>
    </Avatar>
  )
}
