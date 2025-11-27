import { Shape } from '../entities/Shape';
import { Triangle } from '../entities/Triangle';
import { Sphere } from '../entities/Sphere';
import { MutableTriangle } from '../entities/MutableTriangle';
import { MutableSphere } from '../entities/MutableSphere';
import { CompositeSpecification } from './CompositeSpecification';

export class ShapeByDistanceRangeSpecification extends CompositeSpecification<Shape> {
  constructor(private minDistance: number, private maxDistance: number) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    let distance = 0;

    if (shape instanceof Triangle || shape instanceof MutableTriangle) {
      const pointA = shape.getPointA();
      distance = this.calculateDistance(pointA.getX(), pointA.getY(), pointA.getZ());
    } else if (shape instanceof Sphere || shape instanceof MutableSphere) {
      const center = shape.getCenter();
      distance = this.calculateDistance(center.getX(), center.getY(), center.getZ());
    }

    return distance >= this.minDistance && distance <= this.maxDistance;
  }

  private calculateDistance(x: number, y: number, z: number): number {
    return Math.sqrt(x * x + y * y + z * z);
  }
}
