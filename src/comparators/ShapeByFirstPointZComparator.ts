import { Shape } from '../entities/Shape';
import { Triangle } from '../entities/Triangle';
import { Sphere } from '../entities/Sphere';
import { MutableTriangle } from '../entities/MutableTriangle';
import { MutableSphere } from '../entities/MutableSphere';

export class ShapeByFirstPointZComparator {
  public static compare(a: Shape, b: Shape): number {
    const zA = ShapeByFirstPointZComparator.getFirstPointZ(a);
    const zB = ShapeByFirstPointZComparator.getFirstPointZ(b);
    
    return zA - zB;
  }

  private static getFirstPointZ(shape: Shape): number {
    if (shape instanceof Triangle || shape instanceof MutableTriangle) {
      return shape.getPointA().getZ();
    } else if (shape instanceof Sphere || shape instanceof MutableSphere) {
      return shape.getCenter().getZ();
    }
    return 0;
  }
}
