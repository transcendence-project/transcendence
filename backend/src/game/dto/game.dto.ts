import {
    IsArray,
    IsAscii,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Length,
    Min,
} from 'class-validator'


export class objectStatusDto {
    players: PlayerDto[]
    ball: BallDto
}
export class PlayerDto {
    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    login: string

    @Min(0)
    @IsNumber()
    score: number

    paddle: PaddleDto

    @IsUUID()
    @IsNotEmpty()
    @IsOptional()
    gameID?: string

    // powerUps: PowerUp[]
    ready: boolean
}

export class BallDto {
    x: number
    y: number
    dx: number
    dy: number
    radius: number
    speed: number
    color: string
}

export class PaddleDto {
    @IsNumber()
    @IsNotEmpty()
    x: number

    @IsNumber()
    @IsNotEmpty()
    y: number

    @IsNumber()
    @IsNotEmpty()
    width: number

    @IsNumber()
    @IsNotEmpty()
    height: number

    @IsNumber()
    @IsNotEmpty()
    speed: number

    @IsString()
    @Length(0, 100)
    color: string
}