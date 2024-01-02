import { IStudent } from "./student";

export interface IMatch{
	playerOne: IStudent,
	playerTwo: IStudent,
	score: string,
	opponentID: number,
	winnerID: number,
}