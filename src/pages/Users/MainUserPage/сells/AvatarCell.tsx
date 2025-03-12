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
  const user = row.original;
  return (
    <Avatar>
      <AvatarImage src={`${api}/file/${user?.avatar}`} alt="file" />
      <AvatarFallback>AA</AvatarFallback>
    </Avatar>
  )
}
