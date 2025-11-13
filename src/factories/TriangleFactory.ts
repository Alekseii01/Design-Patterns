import { ShapeFactory } from './ShapeFactory';
import { Triangle } from '../entities/Triangle';
import { Point } from '../entities/Point';
import { PointValidator } from '../validators/PointValidator';
import { TriangleValidator } from '../validators/TriangleValidator';
import { ShapeCreationException } from '../exceptions/ShapeCreationException';
import { logger } from '../utils/logger';

export class TriangleFactory extends ShapeFactory {
  private static readonly EXPECTED_PARAMETERS = 9;

  private pointValidator: PointValidator;

  private triangleValidator: TriangleValidator;

  constructor() {
    super();
    this.pointValidator = new PointValidator();
    this.triangleValidator = new TriangleValidator();
  }

  public createShape(id: string, name: string, data: number[]): Triangle {
    try {
      this.validateParameterCount(data, TriangleFactory.EXPECTED_PARAMETERS, 'Triangle');

      const [x1, y1, z1, x2, y2, z2, x3, y3, z3] = data;

      this.pointValidator.validatePoint(x1, y1, z1);
      this.pointValidator.validatePoint(x2, y2, z2);
      this.pointValidator.validatePoint(x3, y3, z3);

      const pointA = new Point(x1, y1, z1);
      const pointB = new Point(x2, y2, z2);
      const pointC = new Point(x3, y3, z3);

      this.triangleValidator.validateTrianglePoints(pointA, pointB, pointC);

      const triangle = new Triangle(id, name, pointA, pointB, pointC);
      logger.info(`Triangle created: ${name} (${id})`);
      return triangle;
    } catch (error) {
      logger.error(`Failed to create triangle: ${error}`);
      throw new ShapeCreationException(`Cannot create triangle: ${error}`);
    }
  }
}
