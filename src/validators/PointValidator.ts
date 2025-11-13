import { ValidationException } from '../exceptions/ValidationException';

export class PointValidator {
  public validateCoordinate(value: number): void {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      throw new ValidationException('Coordinate must be a valid finite number');
    }
  }

  public validatePoint(x: number, y: number, z: number = 0): void {
    this.validateCoordinate(x);
    this.validateCoordinate(y);
    this.validateCoordinate(z);
  }
}
