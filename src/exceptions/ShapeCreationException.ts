import { CustomException } from './CustomException';

export class ShapeCreationException extends CustomException {
  constructor(message: string) {
    super(`Shape creation error: ${message}`);
  }
}
