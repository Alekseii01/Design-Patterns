import { CustomException } from './CustomException';

export class ParseException extends CustomException {
  constructor(message: string) {
    super(`Parse error: ${message}`);
  }
}
