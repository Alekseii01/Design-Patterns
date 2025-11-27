import { Shape } from '../entities/Shape';
import { Triangle } from '../entities/Triangle';
import { Sphere } from '../entities/Sphere';
import { MutableTriangle } from '../entities/MutableTriangle';
import { MutableSphere } from '../entities/MutableSphere';

export class ShapeByFirstPointXComparator {
  public static compare(a: Shape, b: Shape): number {
    const xA = ShapeByFirstPointXComparator.getFirstPointX(a);
    const xB = ShapeByFirstPointXComparator.getFirstPointX(b);
    
    return xA - xB;
  }

  private static getFirstPointX(shape: Shape): number {
    if (shape instanceof Triangle || shape instanceof MutableTriangle) {
      return shape.getPointA().getX();
    } else if (shape instanceof Sphere || shape instanceof MutableSphere) {
      return shape.getCenter().getX();
    }
    return 0;
  }
}
