import { createHash, randomBytes } from 'crypto';

export const generateUniqueString = (length = 4) => {
  const randomString = randomBytes(length).toString('hex');
  const timestamp = Date.now();
  const hash = createHash('sha1')
    .update(randomString + timestamp)
    .digest('hex');
  return hash;
};
