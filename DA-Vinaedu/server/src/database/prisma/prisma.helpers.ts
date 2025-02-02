import { File } from '@prisma/client';

type SELECT_QUERY<T> = { select: { [K in keyof Partial<T>]: boolean } };

export const SELECT_FILE: SELECT_QUERY<File> = {
  select: {
    id: true,
    name: true,
    type: true,
    url: true,
  },
};
