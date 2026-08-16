export type AuthenticatedUser = {
  userId: number;
  email: string;
  role: string;
  teamId: number | null;
};