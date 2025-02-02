import { SetMetadata } from '@nestjs/common';

export const IS_CHECK_VERIFY_KEY = 'isCheckVerify';
export const CheckVerify = () => SetMetadata(IS_CHECK_VERIFY_KEY, true);
