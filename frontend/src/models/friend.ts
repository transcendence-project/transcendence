// import { IStudent as User } from "./student";

// export interface IFriend{
// 	id: number;
// 	sender: User;
// 	reciever: User;
// 	status: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

import { IStudent } from "./student";

export interface IFriend{
	id: number;
	sender: IStudent;
	reciever: IStudent;
	status: string;
	createdAt: Date;
	updatedAt: Date;
}