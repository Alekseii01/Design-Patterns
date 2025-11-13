import { ShapeFactory } from './ShapeFactory';
import { Sphere } from '../entities/Sphere';
import { Point } from '../entities/Point';
import { PointValidator } from '../validators/PointValidator';
import { SphereValidator } from '../validators/SphereValidator';
import { ShapeCreationException } from '../exceptions/ShapeCreationException';
import { logger } from '../utils/logger';

export class SphereFactory extends ShapeFactory {
  private static readonly EXPECTED_PARAMETERS = 4;

  private pointValidator: PointValidator;

  private sphereValidator: SphereValidator;

  constructor() {
    super();
    this.pointValidator = new PointValidator();
    this.sphereValidator = new SphereValidator();
  }

  public createShape(id: string, name: string, data: number[]): Sphere {
    try {
      this.validateParameterCount(data, SphereFactory.EXPECTED_PARAMETERS, 'Sphere');

      const [centerX, centerY, centerZ, radius] = data;

      this.pointValidator.validatePoint(centerX, centerY, centerZ);

      this.sphereValidator.validateRadius(radius);

      const center = new Point(centerX, centerY, centerZ);
      const sphere = new Sphere(id, name, center, radius);

      logger.info(`Sphere created: ${name} (${id})`);
      return sphere;
    } catch (error) {
      logger.error(`Failed to create sphere: ${error}`);
      throw new ShapeCreationException(`Cannot create sphere: ${error}`);
    }
  }
}
