import { Point } from './Point';
import { Shape } from './Shape';

export class Triangle extends Shape {
  private readonly pointA: Point;

  private readonly pointB: Point;

  private readonly pointC: Point;

  constructor(id: string, name: string, pointA: Point, pointB: Point, pointC: Point) {
    super(id, name);
    this.pointA = pointA;
    this.pointB = pointB;
    this.pointC = pointC;
  }

  public getPointA(): Point {
    return this.pointA;
  }

  public getPointB(): Point {
    return this.pointB;
  }

  public getPointC(): Point {
    return this.pointC;
  }
}
