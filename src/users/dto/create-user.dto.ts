import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
    required: true,
  })
  readonly email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password of the user',
    required: true,
  })
  readonly password: string;
}
