import { isEqual } from 'lodash';
import { SuccessResponse } from './success-response';

export const CommonResponse = (data) => {
  if (isEqual(data, SuccessResponse)) {
    return data;
  }
  return {
    success: true,
    data,
  };
};
