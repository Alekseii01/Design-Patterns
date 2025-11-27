import { Shape } from '../entities/Shape';
import { Triangle } from '../entities/Triangle';
import { Sphere } from '../entities/Sphere';
import { MutableTriangle } from '../entities/MutableTriangle';
import { MutableSphere } from '../entities/MutableSphere';
import { CompositeSpecification } from './CompositeSpecification';

export class ShapeInFirstQuadrantSpecification extends CompositeSpecification<Shape> {
  public isSatisfiedBy(shape: Shape): boolean {
    if (shape instanceof Triangle || shape instanceof MutableTriangle) {
      const pointA = shape.getPointA();
      const pointB = shape.getPointB();
      const pointC = shape.getPointC();
      
      return (
        this.isInFirstQuadrant(pointA.getX(), pointA.getY(), pointA.getZ()) &&
        this.isInFirstQuadrant(pointB.getX(), pointB.getY(), pointB.getZ()) &&
        this.isInFirstQuadrant(pointC.getX(), pointC.getY(), pointC.getZ())
      );
    } else if (shape instanceof Sphere || shape instanceof MutableSphere) {
      const center = shape.getCenter();
      return this.isInFirstQuadrant(center.getX(), center.getY(), center.getZ());
    }
    
    return false;
  }

  private isInFirstQuadrant(x: number, y: number, z: number): boolean {
    return x >= 0 && y >= 0 && z >= 0;
  }
}
