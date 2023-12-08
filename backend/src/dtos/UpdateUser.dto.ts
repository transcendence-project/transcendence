import { IsString } from 'class-validator';
// import { Express } from 'express';

export class UpdateUserDTO {
	  @IsString()
	username: string;

	image: string;
}