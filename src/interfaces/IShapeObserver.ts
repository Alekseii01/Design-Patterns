import { Shape } from '../entities/Shape';

export interface IShapeObserver {
  update(shape: Shape): void;
}
