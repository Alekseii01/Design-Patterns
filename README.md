# Система автоматизации доставки

Реализация системы автоматизации процесса доставки с использованием трех паттернов проектирования:
- **Abstract Factory** - создание различных типов доставок
- **Bridge** - разделение абстракции доставки и ее реализации
- **Observer** - оповещение клиентов о статусе доставок

## Структура проекта

```
src/
├── bridge/
│   ├── DeliveryAbstraction.ts      # Абстракция доставки (Bridge)
│   └── DeliveryImplementation.ts   # Реализации доставки (Bridge)
├── observer/
│   ├── DeliveryStatus.ts           # Enum статусов доставки
│   ├── Observer.ts                 # Интерфейс и реализации наблюдателей
│   └── Subject.ts                  # Интерфейс и базовый класс субъекта
├── factory/
│   └── DeliveryFactory.ts          # Abstract Factory для создания доставок
└── index.ts                         # Демонстрация работы системы
```

## Паттерны проектирования

### 1. Abstract Factory (Абстрактная фабрика)

Создает различные типы доставок:
- `StandardDeliveryFactory` - стандартная доставка
- `ExpressDeliveryFactory` - экспресс доставка
- `InternationalDeliveryFactory` - международная доставка

### 2. Bridge (Мост)

Разделяет абстракцию доставки (`DeliveryAbstraction`) от ее реализации (`DeliveryImplementation`):

**Реализации:**
- `TruckDelivery` - доставка грузовиком
- `AirDelivery` - доставка самолетом
- `ShipDelivery` - доставка кораблем
- `CourierDelivery` - доставка курьером

### 3. Observer (Наблюдатель)

Оповещает заинтересованные стороны об изменении статуса доставки:

**Наблюдатели:**
- `ClientObserver` - клиент, получающий уведомления
- `LogisticsObserver` - логистическая система

**Статусы доставки:**
- CREATED - Создана
- PROCESSING - В обработке
- IN_TRANSIT - В пути
- OUT_FOR_DELIVERY - Выехала на доставку
- DELIVERED - Доставлена
- FAILED - Не удалось доставить
- CANCELLED - Отменена

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Скомпилируйте TypeScript:
```bash
npm run build
```

3. Запустите программу:
```bash
npm start
```

Или запустите напрямую через ts-node:
```bash
npm run dev
```

## Пример использования

```typescript
import { StandardDeliveryFactory } from './factory/DeliveryFactory';
import { TruckDelivery } from './bridge/DeliveryImplementation';
import { ClientObserver } from './observer/Observer';

// Создание фабрики
const factory = new StandardDeliveryFactory();

// Создание доставки
const delivery = factory.createDelivery(
  new TruckDelivery(),
  'Ноутбук',
  'Москва, ул. Ленина, д. 10'
);

// Подписка наблюдателя
const client = new ClientObserver('Иван', 'ivan@example.com');
delivery.attach(client);

// Запуск доставки
delivery.processDelivery(delivery.getPackageInfo(), delivery.getDestination());
```

## Особенности реализации

1. **Гибкость Bridge**: Можно изменять реализацию доставки (способ транспортировки) на лету без изменения абстракции.

2. **Расширяемость Abstract Factory**: Легко добавить новые типы доставок, создав новую фабрику.

3. **Множественные наблюдатели**: Один объект доставки может иметь несколько наблюдателей (клиенты, логистика, администрация и т.д.).

4. **Автоматические уведомления**: При изменении статуса доставки все наблюдатели автоматически получают уведомления.

## Технологии

- TypeScript 5.0+
- Node.js



