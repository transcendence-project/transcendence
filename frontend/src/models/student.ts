export interface IStudent {
  id: number;
  display_name: string;
  username: string;
  email: string;
  image: string;
  status: string;
  qr: string;
  win: number;
  lose: number;
  draw: number;
  rank: number;
  isAuthenticated: boolean;
  twofa: boolean;
	achievments: string [];
  
}
