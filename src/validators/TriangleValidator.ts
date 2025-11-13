import { Point } from '../entities/Point';
import { ValidationException } from '../exceptions/ValidationException';

export class TriangleValidator {
  private static readonly EPSILON = 1e-6;

  private calculateDistance(p1: Point, p2: Point): number {
    const dx = p2.getX() - p1.getX();
    const dy = p2.getY() - p1.getY();
    const dz = p2.getZ() - p1.getZ();
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  public validateTrianglePoints(pointA: Point, pointB: Point, pointC: Point): void {
    const sideA = this.calculateDistance(pointB, pointC);
    const sideB = this.calculateDistance(pointA, pointC);
    const sideC = this.calculateDistance(pointA, pointB);

    if (sideA < TriangleValidator.EPSILON
      || sideB < TriangleValidator.EPSILON
      || sideC < TriangleValidator.EPSILON) {
      throw new ValidationException('Points are too close to form a triangle');
    }

    if (sideA + sideB <= sideC + TriangleValidator.EPSILON
      || sideB + sideC <= sideA + TriangleValidator.EPSILON
      || sideC + sideA <= sideB + TriangleValidator.EPSILON) {
      throw new ValidationException('Points do not form a valid triangle (collinear or invalid)');
    }
  }

  public validateArea(area: number): void {
    if (area < 0 || Number.isNaN(area) || !Number.isFinite(area)) {
      throw new ValidationException('Triangle area must be a non-negative finite number');
    }
  }

  public validatePerimeter(perimeter: number): void {
    if (perimeter < 0 || Number.isNaN(perimeter) || !Number.isFinite(perimeter)) {
      throw new ValidationException('Triangle perimeter must be a non-negative finite number');
    }
  }
}
