import { Dispatch, SetStateAction } from 'react';

import { ISettingsNavItem, SettingNavKeyEnum, settingsNav } from '@/pages/settings/constants/settings-nav';

interface Props {
  active: string;
  onChange: Dispatch<SetStateAction<SettingNavKeyEnum>>;
}

export const SettingsNav = ({ active, onChange }: Props) => (
  <nav className="flex flex-col gap-1">
    {settingsNav.map((item: ISettingsNavItem) => (
      <button
        key={item.key}
        type="button"
        onClick={() => onChange(item.key)}
        className={`text-left px-3 py-2 rounded-sm transition ${
          active === item.key ? 'bg-accent/20 text-white' : 'hover:bg-gray-100'
        }`}
      >
        {item.label}
        <p className="text-xs text-gray-400">{item.desc}</p>
      </button>
    ))}
  </nav>
);
