export enum SettingNavKeyEnum {
  PROFILE = 'profile',
  ACCOUNT = 'account',
}

export type ISettingsNavItem = {
  key: SettingNavKeyEnum;
  label: string;
  desc: string;
};

export const settingsNav: ISettingsNavItem[] = [
  { key: SettingNavKeyEnum.PROFILE, label: 'Profile', desc: 'Personal info, Avatar, etc.' },
  { key: SettingNavKeyEnum.ACCOUNT, label: 'Account', desc: 'Authentication, Notifications, etc.' },
];
