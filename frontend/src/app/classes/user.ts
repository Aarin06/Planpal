export interface user {
  username: string;
  googleId: string;
  accessToken: string;
  refreshToken?: string;
  profile: any;
  tier: number;
}
