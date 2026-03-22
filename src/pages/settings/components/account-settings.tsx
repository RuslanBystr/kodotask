import { Button } from '@/components/ui/button';
import { IAccountSettings } from '@/pages/settings/types';

interface Props {
  settings: IAccountSettings;
}

export const AccountSettings = ({ settings }: Props) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold">Account</h2>

    <div className="flex items-center justify-between">
      <span>Email notifications</span>
      <input type="checkbox" defaultChecked={settings.emailNotifications} />
    </div>

    <div className="flex items-center justify-between">
      <span>Two-factor authentication</span>
      <input type="checkbox" defaultChecked={settings.twoFactorEnabled} />
    </div>

    <Button className="self-start px-4 py-2 bg-[--main-button-dark] text-white rounded-lg">Update settings</Button>
  </div>
);
