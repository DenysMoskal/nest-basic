import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Admin',
    description: 'Value of the role',
    required: true,
  })
  readonly value: string;

  @ApiProperty({
    example: 'Can do anything in the system',
    description: 'Description of the role',
    required: true,
  })
  readonly description: string;
}
