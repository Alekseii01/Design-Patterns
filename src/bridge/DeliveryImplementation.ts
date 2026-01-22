/**
 * Bridge Pattern - Implementation Interface
 * Определяет интерфейс для различных способов доставки
 */
export interface DeliveryImplementation {
  deliver(packageInfo: string, destination: string): void;
  getTransportType(): string;
  estimateTime(distance: number): number; // в часах
}

/**
 * Реализация доставки грузовиком
 */
export class TruckDelivery implements DeliveryImplementation {
  deliver(packageInfo: string, destination: string): void {
    console.log(`🚚 Доставка грузовиком: ${packageInfo} в ${destination}`);
  }

  getTransportType(): string {
    return 'Грузовик';
  }

  estimateTime(distance: number): number {
    return distance / 60; // 60 км/ч средняя скорость
  }
}

/**
 * Реализация доставки самолетом
 */
export class AirDelivery implements DeliveryImplementation {
  deliver(packageInfo: string, destination: string): void {
    console.log(`✈️ Доставка самолетом: ${packageInfo} в ${destination}`);
  }

  getTransportType(): string {
    return 'Самолет';
  }

  estimateTime(distance: number): number {
    return distance / 800; // 800 км/ч средняя скорость
  }
}

/**
 * Реализация доставки кораблем
 */
export class ShipDelivery implements DeliveryImplementation {
  deliver(packageInfo: string, destination: string): void {
    console.log(`🚢 Доставка кораблем: ${packageInfo} в ${destination}`);
  }

  getTransportType(): string {
    return 'Корабль';
  }

  estimateTime(distance: number): number {
    return distance / 30; // 30 км/ч средняя скорость
  }
}

/**
 * Реализация доставки курьером
 */
export class CourierDelivery implements DeliveryImplementation {
  deliver(packageInfo: string, destination: string): void {
    console.log(`🚴 Доставка курьером: ${packageInfo} в ${destination}`);
  }

  getTransportType(): string {
    return 'Курьер';
  }

  estimateTime(distance: number): number {
    return distance / 15; // 15 км/ч средняя скорость
  }
}
