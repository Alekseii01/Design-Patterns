import { Shape } from '../entities/Shape';
import { Triangle } from '../entities/Triangle';
import { Sphere } from '../entities/Sphere';
import { MutableTriangle } from '../entities/MutableTriangle';
import { MutableSphere } from '../entities/MutableSphere';

export class ShapeByFirstPointYComparator {
  public static compare(a: Shape, b: Shape): number {
    const yA = ShapeByFirstPointYComparator.getFirstPointY(a);
    const yB = ShapeByFirstPointYComparator.getFirstPointY(b);
    
    return yA - yB;
  }

  private static getFirstPointY(shape: Shape): number {
    if (shape instanceof Triangle || shape instanceof MutableTriangle) {
      return shape.getPointA().getY();
    } else if (shape instanceof Sphere || shape instanceof MutableSphere) {
      return shape.getCenter().getY();
    }
    return 0;
  }
}
