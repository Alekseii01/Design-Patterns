import { Shape } from '../entities/Shape';
import { IShapeCalculator } from '../interfaces/IShapeCalculator';
import { CompositeSpecification } from './CompositeSpecification';

export class ShapeByAreaRangeSpecification extends CompositeSpecification<Shape> {
  constructor(private minArea: number, private maxArea: number) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    if (this.hasCalculateArea(shape)) {
      const area = shape.calculateArea!();
      return area >= this.minArea && area <= this.maxArea;
    }
    return false;
  }

  private hasCalculateArea(shape: Shape): shape is Shape & IShapeCalculator {
    return 'calculateArea' in shape && typeof (shape as any).calculateArea === 'function';
  }
}
