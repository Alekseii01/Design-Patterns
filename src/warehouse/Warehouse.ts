import { IShapeObserver } from '../interfaces/IShapeObserver';
import { Shape } from '../entities/Shape';
import { IShapeCalculator } from '../interfaces/IShapeCalculator';
import { ShapeCharacteristics } from '../interfaces/ShapeCharacteristics';

export class Warehouse implements IShapeObserver {
  private static instance: Warehouse;
  private characteristics: Map<string, ShapeCharacteristics>;

  private constructor() {
    this.characteristics = new Map<string, ShapeCharacteristics>();
  }

  public static getInstance(): Warehouse {
    if (!Warehouse.instance) {
      Warehouse.instance = new Warehouse();
    }
    return Warehouse.instance;
  }

  public update(shape: Shape): void {
    const characteristics: ShapeCharacteristics = {};

    if (this.hasCalculateArea(shape)) {
      characteristics.area = shape.calculateArea!();
    }

    if (this.hasCalculateVolume(shape)) {
      characteristics.volume = shape.calculateVolume!();
    }

    if (this.hasCalculatePerimeter(shape)) {
      characteristics.perimeter = shape.calculatePerimeter!();
    }

    this.characteristics.set(shape.getId(), characteristics);
  }

  public getCharacteristics(shapeId: string): ShapeCharacteristics | undefined {
    return this.characteristics.get(shapeId);
  }

  public getAllCharacteristics(): Map<string, ShapeCharacteristics> {
    return new Map(this.characteristics);
  }

  public removeCharacteristics(shapeId: string): void {
    this.characteristics.delete(shapeId);
  }

  public clear(): void {
    this.characteristics.clear();
  }

  private hasCalculateArea(shape: Shape): shape is Shape & IShapeCalculator {
    return 'calculateArea' in shape && typeof (shape as any).calculateArea === 'function';
  }

  private hasCalculateVolume(shape: Shape): shape is Shape & IShapeCalculator {
    return 'calculateVolume' in shape && typeof (shape as any).calculateVolume === 'function';
  }

  private hasCalculatePerimeter(shape: Shape): shape is Shape & IShapeCalculator {
    return 'calculatePerimeter' in shape && typeof (shape as any).calculatePerimeter === 'function';
  }
}
