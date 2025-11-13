import { FileParser } from './utils/FileParser';
import { TriangleFactory } from './factories/TriangleFactory';
import { SphereFactory } from './factories/SphereFactory';
import { TriangleService } from './services/TriangleService';
import { SphereService } from './services/SphereService';
import { Triangle } from './entities/Triangle';
import { Sphere } from './entities/Sphere';
import { logger } from './utils/logger';

export class Application {
  private fileParser: FileParser;

  private triangleFactory: TriangleFactory;

  private sphereFactory: SphereFactory;

  private triangleService: TriangleService;

  private sphereService: SphereService;

  constructor() {
    this.fileParser = new FileParser();
    this.triangleFactory = new TriangleFactory();
    this.sphereFactory = new SphereFactory();
    this.triangleService = new TriangleService();
    this.sphereService = new SphereService();
  }

  public processTrianglesFile(filePath: string): void {
    try {
      logger.info('=== Processing Triangles File ===');
      const data = this.fileParser.parseFile(filePath);

      data.forEach((values, index) => {
        try {
          const id = `triangle-${index + 1}`;
          const name = `Triangle ${index + 1}`;
          const triangle = this.triangleFactory.createShape(id, name, values) as Triangle;

          this.displayTriangleInfo(triangle);
        } catch (error) {
          logger.warn(`Skipped triangle ${index + 1}: ${error}`);
        }
      });
    } catch (error) {
      logger.error(`Error processing triangles file: ${error}`);
    }
  }

  public processSpheresFile(filePath: string): void {
    try {
      logger.info('=== Processing Spheres File ===');
      const data = this.fileParser.parseFile(filePath);

      data.forEach((values, index) => {
        try {
          const id = `sphere-${index + 1}`;
          const name = `Sphere ${index + 1}`;
          const sphere = this.sphereFactory.createShape(id, name, values) as Sphere;

          this.displaySphereInfo(sphere);
        } catch (error) {
          logger.warn(`Skipped sphere ${index + 1}: ${error}`);
        }
      });
    } catch (error) {
      logger.error(`Error processing spheres file: ${error}`);
    }
  }

  private displayTriangleInfo(triangle: Triangle): void {
    logger.info(`\n--- ${triangle.getName()} (${triangle.getId()}) ---`);

    const area = this.triangleService.calculateArea(triangle);
    const perimeter = this.triangleService.calculatePerimeter(triangle);

    logger.info(`Area: ${area.toFixed(4)}`);
    logger.info(`Perimeter: ${perimeter.toFixed(4)}`);
    logger.info(`Is Right Triangle: ${this.triangleService.isRightTriangle(triangle)}`);
    logger.info(`Is Isosceles: ${this.triangleService.isIsosceles(triangle)}`);
    logger.info(`Is Equilateral: ${this.triangleService.isEquilateral(triangle)}`);
    logger.info(`Is Acute: ${this.triangleService.isAcute(triangle)}`);
    logger.info(`Is Obtuse: ${this.triangleService.isObtuse(triangle)}`);
  }

  private displaySphereInfo(sphere: Sphere): void {
    logger.info(`\n--- ${sphere.getName()} (${sphere.getId()}) ---`);

    const surfaceArea = this.sphereService.calculateSurfaceArea(sphere);
    const volume = this.sphereService.calculateVolume(sphere);

    logger.info(`Surface Area: ${surfaceArea.toFixed(4)}`);
    logger.info(`Volume: ${volume.toFixed(4)}`);
    logger.info(`Is Sphere: ${this.sphereService.isSphere(sphere)}`);
    logger.info(`Touches XY Plane: ${this.sphereService.touchesXYPlane(sphere)}`);
    logger.info(`Touches XZ Plane: ${this.sphereService.touchesXZPlane(sphere)}`);
    logger.info(`Touches YZ Plane: ${this.sphereService.touchesYZPlane(sphere)}`);

    const ratioXY = this.sphereService.calculateVolumeRatioXY(sphere);
    const ratioXZ = this.sphereService.calculateVolumeRatioXZ(sphere);
    const ratioYZ = this.sphereService.calculateVolumeRatioYZ(sphere);

    logger.info(`Volume Ratio (XY plane): ${ratioXY.toFixed(4)}`);
    logger.info(`Volume Ratio (XZ plane): ${ratioXZ.toFixed(4)}`);
    logger.info(`Volume Ratio (YZ plane): ${ratioYZ.toFixed(4)}`);
  }
}

if (require.main === module) {
  const app = new Application();

  app.processTrianglesFile('./data/triangles.txt');

  app.processSpheresFile('./data/spheres.txt');
}
