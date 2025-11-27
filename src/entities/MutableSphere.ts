import { Point } from './Point';
import { Shape } from './Shape';
import { IShapeCalculator } from '../interfaces/IShapeCalculator';

export class MutableSphere extends Shape implements IShapeCalculator {
  private center: Point;

  private radius: number;

  constructor(id: string, name: string, center: Point, radius: number) {
    super(id, name);
    this.center = center;
    this.radius = radius;
    this.notifyObservers();
  }

  public getCenter(): Point {
    return this.center;
  }

  public setCenter(center: Point): void {
    this.center = center;
    this.notifyObservers();
  }

  public getRadius(): number {
    return this.radius;
  }

  public setRadius(radius: number): void {
    this.radius = radius;
    this.notifyObservers();
  }

  public calculateArea(): number {
    return 4 * Math.PI * this.radius * this.radius;
  }

  public calculateVolume(): number {
    return (4 / 3) * Math.PI * Math.pow(this.radius, 3);
  }
}
