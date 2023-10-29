import { IsOptional, IsString } from 'class-validator';

export class UpdateUserLoginDto {
  @IsOptional()
  @IsString()
  login: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;
}
