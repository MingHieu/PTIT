import { ForbiddenException } from '@nestjs/common';

export const OwnerErrorResponse = () => {
  throw new ForbiddenException(
    'You do not have permission to modify this record',
  );
};
