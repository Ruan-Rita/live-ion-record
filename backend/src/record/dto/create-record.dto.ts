import { IsNumber, IsString } from "class-validator";

export class CreateRecordDto {
    @IsString()
    name: string;

    @IsString()
    filePath: string;

    @IsNumber()
    userId: number;

    @IsString()
    token: string;
}
