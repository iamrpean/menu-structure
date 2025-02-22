import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMenuDto {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    parentId?: number;
}