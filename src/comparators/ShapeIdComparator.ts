import { Shape } from '../entities/Shape';

export class ShapeIdComparator {
  public static compare(a: Shape, b: Shape): number {
    return a.getId().localeCompare(b.getId());
  }
}
