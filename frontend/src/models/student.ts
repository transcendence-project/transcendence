export interface IStudent {
  id: number;
  display_name: string;
  username: string;
  email: string;
  image: string;
  status: string;
  qr: string;
  wins: number;
  loses: number;
  draw: number;
  rank: number;
  twofa: boolean;
  achievments: string[];
}
