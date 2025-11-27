import { Point } from './Point';
import { Shape } from './Shape';
import { IShapeCalculator } from '../interfaces/IShapeCalculator';

export class MutableTriangle extends Shape implements IShapeCalculator {
  private pointA: Point;

  private pointB: Point;

  private pointC: Point;

  constructor(id: string, name: string, pointA: Point, pointB: Point, pointC: Point) {
    super(id, name);
    this.pointA = pointA;
    this.pointB = pointB;
    this.pointC = pointC;
    this.notifyObservers();
  }

  public getPointA(): Point {
    return this.pointA;
  }

  public setPointA(point: Point): void {
    this.pointA = point;
    this.notifyObservers();
  }

  public getPointB(): Point {
    return this.pointB;
  }

  public setPointB(point: Point): void {
    this.pointB = point;
    this.notifyObservers();
  }

  public getPointC(): Point {
    return this.pointC;
  }

  public setPointC(point: Point): void {
    this.pointC = point;
    this.notifyObservers();
  }

  public calculateArea(): number {
    const a = this.calculateSideLength(this.pointA, this.pointB);
    const b = this.calculateSideLength(this.pointB, this.pointC);
    const c = this.calculateSideLength(this.pointC, this.pointA);
    
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }

  public calculatePerimeter(): number {
    const a = this.calculateSideLength(this.pointA, this.pointB);
    const b = this.calculateSideLength(this.pointB, this.pointC);
    const c = this.calculateSideLength(this.pointC, this.pointA);
    
    return a + b + c;
  }

  private calculateSideLength(p1: Point, p2: Point): number {
    const dx = p2.getX() - p1.getX();
    const dy = p2.getY() - p1.getY();
    const dz = p2.getZ() - p1.getZ();
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}
