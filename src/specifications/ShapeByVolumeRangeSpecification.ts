import { Shape } from '../entities/Shape';
import { IShapeCalculator } from '../interfaces/IShapeCalculator';
import { CompositeSpecification } from './CompositeSpecification';

export class ShapeByVolumeRangeSpecification extends CompositeSpecification<Shape> {
  constructor(private minVolume: number, private maxVolume: number) {
    super();
  }

  public isSatisfiedBy(shape: Shape): boolean {
    if (this.hasCalculateVolume(shape)) {
      const volume = shape.calculateVolume!();
      return volume >= this.minVolume && volume <= this.maxVolume;
    }
    return false;
  }

  private hasCalculateVolume(shape: Shape): shape is Shape & IShapeCalculator {
    return 'calculateVolume' in shape && typeof (shape as any).calculateVolume === 'function';
  }
}
