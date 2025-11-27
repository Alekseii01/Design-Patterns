import { IShapeObserver } from '../interfaces/IShapeObserver';

export abstract class Shape {
  private readonly id: string;

  private readonly name: string;

  private observers: IShapeObserver[];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.observers = [];
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public attach(observer: IShapeObserver): void {
    this.observers.push(observer);
  }

  public detach(observer: IShapeObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  protected notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }
}
