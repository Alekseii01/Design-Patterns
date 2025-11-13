import { Point } from './Point';
import { Shape } from './Shape';

export class Sphere extends Shape {
  private readonly center: Point;

  private readonly radius: number;

  constructor(id: string, name: string, center: Point, radius: number) {
    super(id, name);
    this.center = center;
    this.radius = radius;
  }

  public getCenter(): Point {
    return this.center;
  }

  public getRadius(): number {
    return this.radius;
  }
}
