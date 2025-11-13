import { Triangle } from '../entities/Triangle';
import { Point } from '../entities/Point';
import { TriangleValidator } from '../validators/TriangleValidator';

export class TriangleService {
  private static readonly EPSILON = 1e-6;

  private validator: TriangleValidator;

  constructor() {
    this.validator = new TriangleValidator();
  }

  private calculateDistance(p1: Point, p2: Point): number {
    const dx = p2.getX() - p1.getX();
    const dy = p2.getY() - p1.getY();
    const dz = p2.getZ() - p1.getZ();
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private getSides(triangle: Triangle): [number, number, number] {
    const sideA = this.calculateDistance(triangle.getPointB(), triangle.getPointC());
    const sideB = this.calculateDistance(triangle.getPointA(), triangle.getPointC());
    const sideC = this.calculateDistance(triangle.getPointA(), triangle.getPointB());
    return [sideA, sideB, sideC];
  }

  public calculatePerimeter(triangle: Triangle): number {
    const [sideA, sideB, sideC] = this.getSides(triangle);
    const perimeter = sideA + sideB + sideC;
    this.validator.validatePerimeter(perimeter);
    return perimeter;
  }

  public calculateArea(triangle: Triangle): number {
    const [sideA, sideB, sideC] = this.getSides(triangle);
    const semiPerimeter = (sideA + sideB + sideC) / 2;
    const area = Math.sqrt(
      semiPerimeter
        * (semiPerimeter - sideA)
        * (semiPerimeter - sideB)
        * (semiPerimeter - sideC),
    );
    this.validator.validateArea(area);
    return area;
  }

  public isRightTriangle(triangle: Triangle): boolean {
    const sides = this.getSides(triangle).sort((a, b) => a - b);
    const [a, b, c] = sides;

    const leftSide = a * a + b * b;
    const rightSide = c * c;

    return Math.abs(leftSide - rightSide) < TriangleService.EPSILON;
  }

  public isIsosceles(triangle: Triangle): boolean {
    const [sideA, sideB, sideC] = this.getSides(triangle);

    return (
      Math.abs(sideA - sideB) < TriangleService.EPSILON
      || Math.abs(sideB - sideC) < TriangleService.EPSILON
      || Math.abs(sideC - sideA) < TriangleService.EPSILON
    );
  }

  public isEquilateral(triangle: Triangle): boolean {
    const [sideA, sideB, sideC] = this.getSides(triangle);

    return (
      Math.abs(sideA - sideB) < TriangleService.EPSILON
      && Math.abs(sideB - sideC) < TriangleService.EPSILON
    );
  }

  public isAcute(triangle: Triangle): boolean {
    const sides = this.getSides(triangle).sort((a, b) => a - b);
    const [a, b, c] = sides;

    return a * a + b * b > c * c + TriangleService.EPSILON;
  }

  public isObtuse(triangle: Triangle): boolean {
    const sides = this.getSides(triangle).sort((a, b) => a - b);
    const [a, b, c] = sides;

    return a * a + b * b < c * c - TriangleService.EPSILON;
  }

  public isValidTriangle(pointA: Point, pointB: Point, pointC: Point): boolean {
    try {
      this.validator.validateTrianglePoints(pointA, pointB, pointC);
      return true;
    } catch (error) {
      return false;
    }
  }
}
