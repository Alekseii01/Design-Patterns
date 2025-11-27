import { Shape } from '../entities/Shape';
import { CompositeSpecification } from './CompositeSpecification';

export class ShapeByNameSpecification extends CompositeSpecification<Shape> {
  constructor(private name: string) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    return shape.getName() === this.name;
  }
}
