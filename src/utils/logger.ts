import pino from 'pino';
import path from 'path';

const LOG_FILE_PATH = path.join(__dirname, '../../logs/app.log');

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
        level: 'info',
      },
      {
        target: 'pino/file',
        options: {
          destination: LOG_FILE_PATH,
          mkdir: true,
        },
        level: 'info',
      },
    ],
  },
});
