import { CustomException } from './CustomException';

export class ValidationException extends CustomException {
  constructor(message: string) {
    super(`Validation error: ${message}`);
  }
}
