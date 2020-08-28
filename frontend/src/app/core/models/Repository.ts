export interface Repository {
  id: number;
  name: string;
  description: string;
  private: boolean;
  url: string;
  createdByLink: boolean;
  owner: string;
}
