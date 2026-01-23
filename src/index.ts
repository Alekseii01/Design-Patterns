import { DeliveryFactory, StandardDeliveryFactory, ExpressDeliveryFactory, InternationalDeliveryFactory } from './factory/DeliveryFactory';
import { TruckDelivery, AirDelivery, ShipDelivery, CourierDelivery } from './bridge/DeliveryImplementation';
import { ClientObserver, LogisticsObserver } from './observer/Observer';
import { DeliveryStatus } from './observer/DeliveryStatus';

function main() {
  console.log('=== Система автоматизации доставки ===\n');

  const client1 = new ClientObserver('Иван Петров', 'ivan@example.com');
  const client2 = new ClientObserver('Мария Сидорова', 'maria@example.com');
  const logisticsSystem = new LogisticsObserver();

  const standardFactory = new StandardDeliveryFactory();
  const expressFactory = new ExpressDeliveryFactory();
  const internationalFactory = new InternationalDeliveryFactory();

  const truckDelivery = new TruckDelivery();
  const airDelivery = new AirDelivery();
  const shipDelivery = new ShipDelivery();
  const courierDelivery = new CourierDelivery();

  console.log('--- Пример 1: Стандартная доставка грузовиком ---');
  const delivery1 = standardFactory.createDelivery(
    truckDelivery,
    'Электроника - Ноутбук',
    'Москва, ул. Ленина, д. 10'
  );
  delivery1.attach(client1);
  delivery1.attach(logisticsSystem);
  delivery1.processDelivery(delivery1.getPackageInfo(), delivery1.getDestination());
  
  console.log(`Тип транспорта: ${delivery1.getTransportType()}`);
  console.log(`Ориентировочное время доставки: ${delivery1.estimateDeliveryTime(300).toFixed(2)} часов\n`);

  setTimeout(() => {
    console.log('\n--- Пример 2: Экспресс доставка самолетом ---');
    const delivery2 = expressFactory.createDelivery(
      airDelivery,
      'Документы - Срочные',
      'Санкт-Петербург, Невский проспект, д. 1'
    );
    delivery2.attach(client2);
    delivery2.attach(logisticsSystem);
    delivery2.processDelivery(delivery2.getPackageInfo(), delivery2.getDestination());
    
    console.log(`Тип транспорта: ${delivery2.getTransportType()}`);
    console.log(`Ориентировочное время доставки: ${delivery2.estimateDeliveryTime(600).toFixed(2)} часов\n`);
  }, 2000);

  setTimeout(() => {
    console.log('\n--- Пример 3: Международная доставка кораблем ---');
    const delivery3 = internationalFactory.createDelivery(
      shipDelivery,
      'Товары - Оборудование',
      'Владивосток, порт'
    );
    delivery3.attach(client1);
    delivery3.attach(logisticsSystem);
    delivery3.processDelivery(delivery3.getPackageInfo(), delivery3.getDestination());
    
    console.log(`Тип транспорта: ${delivery3.getTransportType()}`);
    console.log(`Ориентировочное время доставки: ${delivery3.estimateDeliveryTime(2000).toFixed(2)} часов\n`);
  }, 4000);

  setTimeout(() => {
    console.log('\n--- Пример 4: Доставка курьером с изменением реализации (Bridge) ---');
    const delivery4 = standardFactory.createDelivery(
      courierDelivery,
      'Еда - Пицца',
      'Москва, ул. Пушкина, д. 5'
    );
    delivery4.attach(client2);
    
    console.log(`Изначальный тип транспорта: ${delivery4.getTransportType()}`);
    
    delivery4.setImplementation(truckDelivery);
    console.log(`Измененный тип транспорта: ${delivery4.getTransportType()}`);
    
    delivery4.processDelivery(delivery4.getPackageInfo(), delivery4.getDestination());
    console.log(`Ориентировочное время доставки: ${delivery4.estimateDeliveryTime(20).toFixed(2)} часов\n`);
  }, 6000);
}

main();
