import { Observer } from './Observer';
import { DeliveryStatus } from './DeliveryStatus';

/**
 * Observer Pattern - Subject Interface
 * Интерфейс для объектов, за которыми наблюдают
 */
export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(deliveryId: string, status: DeliveryStatus, message?: string): void;
}

/**
 * Базовый класс для объектов с наблюдателями
 */
export abstract class DeliverySubject implements Subject {
  private observers: Observer[] = [];

  attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return;
    }
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return;
    }
    this.observers.splice(observerIndex, 1);
  }

  notify(deliveryId: string, status: DeliveryStatus, message?: string): void {
    for (const observer of this.observers) {
      observer.update(deliveryId, status, message);
    }
  }
}
