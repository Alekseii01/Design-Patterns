import { DeliveryAbstraction } from '../bridge/DeliveryAbstraction';
import { DeliveryImplementation } from '../bridge/DeliveryImplementation';
import { DeliveryStatus } from '../observer/DeliveryStatus';
import { Observer } from '../observer/Observer';
import { Subject } from '../observer/Subject';

/**
 * Abstract Factory Pattern - Abstract Factory
 * Абстрактная фабрика для создания различных типов доставок
 */
export abstract class DeliveryFactory {
  abstract createDelivery(
    implementation: DeliveryImplementation,
    packageInfo: string,
    destination: string
  ): Delivery;
}

/**
 * Конкретная доставка, объединяющая Bridge и Observer
 */
export class Delivery extends DeliveryAbstraction implements Subject {
  private deliveryId: string;
  private packageInfo: string;
  private destination: string;
  private status: DeliveryStatus;
  private observers: Observer[] = [];

  constructor(
    implementation: DeliveryImplementation,
    packageInfo: string,
    destination: string
  ) {
    super(implementation);
    this.deliveryId = `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.packageInfo = packageInfo;
    this.destination = destination;
    this.status = DeliveryStatus.CREATED;
  }

  processDelivery(packageInfo: string, destination: string): void {
    this.updateStatus(DeliveryStatus.PROCESSING, 'Начало обработки заказа');
    
    setTimeout(() => {
      this.updateStatus(DeliveryStatus.IN_TRANSIT, 'Посылка отправлена');
      this.implementation.deliver(packageInfo, destination);
      
      setTimeout(() => {
        this.updateStatus(DeliveryStatus.OUT_FOR_DELIVERY, 'Курьер выехал');
        
        setTimeout(() => {
          this.updateStatus(DeliveryStatus.DELIVERED, 'Посылка успешно доставлена');
        }, 1000);
      }, 1000);
    }, 1000);
  }

  updateStatus(status: DeliveryStatus, message?: string): void {
    this.status = status;
    this.notify(this.deliveryId, status, message);
  }

  getDeliveryId(): string {
    return this.deliveryId;
  }

  getStatus(): DeliveryStatus {
    return this.status;
  }

  getPackageInfo(): string {
    return this.packageInfo;
  }

  getDestination(): string {
    return this.destination;
  }

  // Observer methods (Subject interface)
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

/**
 * Конкретная фабрика - Стандартная доставка
 */
export class StandardDeliveryFactory extends DeliveryFactory {
  createDelivery(
    implementation: DeliveryImplementation,
    packageInfo: string,
    destination: string
  ): Delivery {
    return new Delivery(implementation, packageInfo, destination);
  }
}

/**
 * Конкретная фабрика - Экспресс доставка
 */
export class ExpressDeliveryFactory extends DeliveryFactory {
  createDelivery(
    implementation: DeliveryImplementation,
    packageInfo: string,
    destination: string
  ): Delivery {
    const delivery = new Delivery(implementation, packageInfo, destination);
    // Экспресс доставка может иметь дополнительные настройки
    return delivery;
  }
}

/**
 * Конкретная фабрика - Международная доставка
 */
export class InternationalDeliveryFactory extends DeliveryFactory {
  createDelivery(
    implementation: DeliveryImplementation,
    packageInfo: string,
    destination: string
  ): Delivery {
    const delivery = new Delivery(implementation, packageInfo, destination);
    // Международная доставка может иметь дополнительные настройки
    return delivery;
  }
}

