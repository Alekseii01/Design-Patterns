import { Shape } from '../entities/Shape';
import { CompositeSpecification } from './CompositeSpecification';

export class ShapeByIdSpecification extends CompositeSpecification<Shape> {
  constructor(private id: string) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    return shape.getId() === this.id;
  }
}
