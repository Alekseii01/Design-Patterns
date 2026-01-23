export interface DeliveryImplementation {
  deliver(packageInfo: string, destination: string): void;
  getTransportType(): string;
  estimateTime(distance: number): number;
}

export class TruckDelivery implements DeliveryImplementation {
  deliver(packageInfo: string, destination: string): void {
    console.log(`🚚 Доставка грузовиком: ${packageInfo} в ${destination}`);
  }

  getTransportType(): string {
    return 'Грузовик';
  }

  estimateTime(distance: number): number {
    return distance / 60;
  }
}

export class AirDelivery implements DeliveryImplementation {
  deliver(packageInfo: string, destination: string): void {
    console.log(`✈️ Доставка самолетом: ${packageInfo} в ${destination}`);
  }

  getTransportType(): string {
    return 'Самолет';
  }

  estimateTime(distance: number): number {
    return distance / 800;
  }
}

export class ShipDelivery implements DeliveryImplementation {
  deliver(packageInfo: string, destination: string): void {
    console.log(`🚢 Доставка кораблем: ${packageInfo} в ${destination}`);
  }

  getTransportType(): string {
    return 'Корабль';
  }

  estimateTime(distance: number): number {
    return distance / 30;
  }
}

export class CourierDelivery implements DeliveryImplementation {
  deliver(packageInfo: string, destination: string): void {
    console.log(`🚴 Доставка курьером: ${packageInfo} в ${destination}`);
  }

  getTransportType(): string {
    return 'Курьер';
  }

  estimateTime(distance: number): number {
    return distance / 15;
  }
}
