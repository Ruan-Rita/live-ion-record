import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateOrUpdateRecordDto {
    @IsString()
    filename: string;

    @IsString()
    token: string;

    @IsNumber()
    index: number;

    @IsNotEmpty()
    file: Express.Multer.File;

    @IsNumber()
    userId: number;
}
