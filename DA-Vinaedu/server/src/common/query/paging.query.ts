import { IsNotEmpty } from 'class-validator';

export class PagingQuery {
  @IsNotEmpty()
  page: number;

  records: number = 10;
}
