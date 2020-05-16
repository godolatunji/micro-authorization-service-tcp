import { generateKeyPairSync, randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';

export interface IKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface ISecret {
  secret: string;
}

export const getKeyPair = (): IKeyPair => {
  return generateKeyPairSync('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
};

export const generateToken = (user, secret: string): string => {
  return jwt.sign({ userId: user.id }, secret, {
    algorithm: 'HS512',
    expiresIn: '10h',
  });
};

export const getRandomString = () => randomBytes(200).toString('hex');
