import { DeliveryImplementation } from './DeliveryImplementation';

export abstract class DeliveryAbstraction {
  protected implementation: DeliveryImplementation;

  constructor(implementation: DeliveryImplementation) {
    this.implementation = implementation;
  }

  abstract processDelivery(packageInfo: string, destination: string): void;
  
  getTransportType(): string {
    return this.implementation.getTransportType();
  }

  estimateDeliveryTime(distance: number): number {
    return this.implementation.estimateTime(distance);
  }

  setImplementation(implementation: DeliveryImplementation): void {
    this.implementation = implementation;
  }
}
