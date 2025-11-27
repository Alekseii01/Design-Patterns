import { Shape } from '../entities/Shape';
import { ISpecification } from '../specifications/ISpecification';
import { Warehouse } from '../warehouse/Warehouse';

export class ShapeRepository {
  private shapes: Map<string, Shape>;
  private warehouse: Warehouse;

  constructor() {
    this.shapes = new Map<string, Shape>();
    this.warehouse = Warehouse.getInstance();
  }

  public add(shape: Shape): void {
    this.shapes.set(shape.getId(), shape);
    shape.attach(this.warehouse);
    this.warehouse.update(shape);
  }

  public remove(id: string): boolean {
    const shape = this.shapes.get(id);
    if (shape) {
      shape.detach(this.warehouse);
      this.warehouse.removeCharacteristics(id);
      return this.shapes.delete(id);
    }
    return false;
  }

  public findById(id: string): Shape | undefined {
    return this.shapes.get(id);
  }

  public findAll(): Shape[] {
    return Array.from(this.shapes.values());
  }

  public findBySpecification(specification: ISpecification<Shape>): Shape[] {
    return this.findAll().filter((shape) => specification.isSatisfiedBy(shape));
  }

  public sort(comparator: (a: Shape, b: Shape) => number): Shape[] {
    return this.findAll().sort(comparator);
  }

  public clear(): void {
    this.shapes.forEach((shape) => {
      shape.detach(this.warehouse);
    });
    this.shapes.clear();
    this.warehouse.clear();
  }

  public size(): number {
    return this.shapes.size;
  }
}
