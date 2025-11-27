import { Shape } from '../entities/Shape';
import { IShapeCalculator } from '../interfaces/IShapeCalculator';
import { CompositeSpecification } from './CompositeSpecification';

export class ShapeByPerimeterRangeSpecification extends CompositeSpecification<Shape> {
  constructor(private minPerimeter: number, private maxPerimeter: number) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    if (this.hasCalculatePerimeter(shape)) {
      const perimeter = shape.calculatePerimeter!();
      return perimeter >= this.minPerimeter && perimeter <= this.maxPerimeter;
    }
    return false;
  }

  private hasCalculatePerimeter(shape: Shape): shape is Shape & IShapeCalculator {
    return 'calculatePerimeter' in shape && typeof (shape as any).calculatePerimeter === 'function';
  }
}
