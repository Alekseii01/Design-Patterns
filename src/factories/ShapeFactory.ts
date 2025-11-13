import { Shape } from '../entities/Shape';

export abstract class ShapeFactory {
  public abstract createShape(id: string, name: string, data: number[]): Shape;

  protected validateParameterCount(data: number[], expected: number, shapeName: string): void {
    if (data.length !== expected) {
      throw new Error(
        `Invalid parameter count for ${shapeName}: expected ${expected}, got ${data.length}`,
      );
    }
  }
}
