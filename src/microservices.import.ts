import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from './config';
import { TYPES } from './types';

export const microservices = [
  ClientsModule.register([
    {
      name: TYPES.USER_SVC,
      transport: Transport.TCP,
      options: {
        host: config.userSvc.split(':')[0],
        port: Number.parseInt(config.userSvc.split(':')[1], 10),
      },
    },
  ]),
];
