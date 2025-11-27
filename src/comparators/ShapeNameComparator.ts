import { Shape } from '../entities/Shape';

export class ShapeNameComparator {
  public static compare(a: Shape, b: Shape): number {
    return a.getName().localeCompare(b.getName());
  }
}
