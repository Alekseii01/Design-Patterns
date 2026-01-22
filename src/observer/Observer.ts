import { DeliveryStatus } from './DeliveryStatus';

/**
 * Observer Pattern - Observer Interface
 * Интерфейс для наблюдателей, которые будут получать уведомления
 */
export interface Observer {
  update(deliveryId: string, status: DeliveryStatus, message?: string): void;
}

/**
 * Конкретный наблюдатель - Клиент
 */
export class ClientObserver implements Observer {
  private name: string;
  private email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }

  update(deliveryId: string, status: DeliveryStatus, message?: string): void {
    console.log(`Уведомление для ${this.name} (${this.email}):`);
    console.log(`Доставка #${deliveryId}: ${status}`);
    if (message) {
      console.log(`Сообщение: ${message}`);
    }
    console.log('');
  }

  getName(): string {
    return this.name;
  }
}

/**
 * Конкретный наблюдатель - Логистическая система
 */
export class LogisticsObserver implements Observer {
  update(deliveryId: string, status: DeliveryStatus, message?: string): void {
    console.log(`Логистическая система: Доставка #${deliveryId} - ${status}`);
    if (message) {
      console.log(`Детали: ${message}`);
    }
  }
}
