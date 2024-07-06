export type Account = {
  accountId: number;
  username: string;
  privileges: number;
  country: string;
  silenceEnd: Date | null;
  createdAt: Date;
};
