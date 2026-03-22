import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { IUserResponse } from '@/types/responses/IUserResponse';

interface Props {
  profile: IUserResponse;
}

export const ProfileSettings = ({ profile }: Props) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold">Profile</h2>

    <div className="flex items-center gap-4">
      <img
        src="https://i.pravatar.cc/150?img=3"
        alt={`${profile.firstName} ${profile.lastName}'s profile`}
        className="w-16 h-16 rounded-full"
      />
      <div>
        <div className="font-medium">
          {profile.firstName} {profile.lastName}
        </div>
        <div className="text-sm text-gray-500">{profile.email}</div>
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <Label className="text-sm" htmlFor="settings-name">
        Name
      </Label>
      <input
        id="settings-name"
        defaultValue={profile.firstName}
        className="
            border rounded-sm bg-accent/10 px-3 py-2
            outline-none
            focus:ring-1 focus:ring-[--main-button]
            focus:ring-offset-2
            transition
          "
      />
    </div>

    <Button className="self-start px-4 py-2 bg-[--main-button-dark] text-white rounded-lg">Save changes</Button>
  </div>
);
