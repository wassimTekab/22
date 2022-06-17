import { ApiProperty } from "@nestjs/swagger";
import { Cat } from "./Cat";
export class getListCatDto {
  @ApiProperty({
    type: [Cat],
  })
  readonly paginatedResult!: [Cat];

  @ApiProperty({
    type: Number,
  })
  readonly totalCount!: number;
}
