export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface IAccountSettings {
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
}
