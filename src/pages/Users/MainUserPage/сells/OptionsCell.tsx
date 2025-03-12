import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { EllipsisVerticalIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCreatePrivateChatMutation } from '@/services/chat';
import { useDeleteUserMutation } from '@/services/users';
import { selectAuthenticatedUserSelector } from '@/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OptionsCell = ({ row }: { row: any }) => {
  const navigate = useNavigate()
  const userId = row.original?.id;
  const [ createPrivateChat ] = useCreatePrivateChatMutation()
  const [ deleteUser ] = useDeleteUserMutation()
  const userData = useSelector(selectAuthenticatedUserSelector);

  // eslint-disable-next-line consistent-return
  const openChat = async () => {
    try {
      await createPrivateChat({
        user1Id: userId,
        user2Id: userData?.id
      }).unwrap();

      navigate(`/chats/user/${userId}`);
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'status' in err) {
        const error = err as FetchBaseQueryError;
        if (error.status === 409) {
          navigate(`/chats/user/${userId}`);
        }
      } else {
        return err;
      }
    }
  };

  const handleEdit = () => {
    navigate(`/users/edit/${userId}`);
  }

  const handleDelete = () => {
    deleteUser(userId)
  }
  return (
    <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={openChat}>Message</DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
};
