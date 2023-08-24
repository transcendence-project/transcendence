import {IsEmail, IsString, IsNotEmpty} from "class-validator"

// DTO - used to valudate incoming requests bodies

export class createUserDTO {
	@IsNotEmpty()
	id: number

	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsString()
	login: string

	@IsNotEmpty()
	@IsString()
	name: string
}