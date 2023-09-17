import {IsEmail, IsString, IsNotEmpty} from "class-validator"

// DTO - used to valudate incoming requests bodies

export class createUserDTO {
	
	@IsEmail()
	email: string

	@IsString()
	username: string
}
