import { useState } from 'react';
import { useSelector } from 'react-redux';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { ProfileSettings } from '@/pages/settings/components/profile-settings';
import { SettingNavKeyEnum } from '@/pages/settings/constants/settings-nav';
import { SettingsNav } from '@/pages/settings/settings-nav';
import { selectAuthenticatedUserSelector } from '@/store';

import { AccountSettings } from './components/account-settings';
import { mockAccountSettings } from './data/mock-settings';

export const SettingsPage = () => {
  const { isMobile } = useSidebar();

  const userData = useSelector(selectAuthenticatedUserSelector);
  const [active, setActive] = useState<SettingNavKeyEnum>(SettingNavKeyEnum.PROFILE);
  if (!userData) return null;

  return (
    <div className="p-2 md:p-8 w-full h-full">
      {isMobile && <SidebarTrigger className="-ml-1" />}
      <h1 className="text-2xl font-semibold">Settings</h1>
      <h3 className="text-sm">Manage your account and application preferences</h3>

      <div className="flex md:gap-6 mt-6 p-2 md:p-6 bg-transparent/10">
        <div className="md:w-[284px] border-r p-2">
          <SettingsNav active={active} onChange={setActive} />
        </div>

        <main className="flex-1 mx-2">
          {active === 'profile' && <ProfileSettings profile={userData} />}

          {active === 'account' && <AccountSettings settings={mockAccountSettings} />}
        </main>
      </div>
    </div>
  );
};
