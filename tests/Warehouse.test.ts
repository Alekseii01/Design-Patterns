import { Warehouse } from '../src/warehouse/Warehouse';
import { MutableSphere } from '../src/entities/MutableSphere';
import { MutableTriangle } from '../src/entities/MutableTriangle';
import { Point } from '../src/entities/Point';

describe('Warehouse', () => {
  let warehouse: Warehouse;

  beforeEach(() => {
    warehouse = Warehouse.getInstance();
    warehouse.clear();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = Warehouse.getInstance();
      const instance2 = Warehouse.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Observer Pattern', () => {
    it('should update characteristics when notified', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      sphere.attach(warehouse);
      warehouse.update(sphere);
      
      const characteristics = warehouse.getCharacteristics('sphere-1');
      
      expect(characteristics).toBeDefined();
      expect(characteristics?.area).toBeCloseTo(314.159, 2);
      expect(characteristics?.volume).toBeCloseTo(523.598, 2);
    });

    it('should store triangle characteristics', () => {
      const triangle = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0)
      );
      triangle.attach(warehouse);
      warehouse.update(triangle);
      
      const characteristics = warehouse.getCharacteristics('triangle-1');
      
      expect(characteristics).toBeDefined();
      expect(characteristics?.area).toBeCloseTo(6, 2);
      expect(characteristics?.perimeter).toBe(12);
      expect(characteristics?.volume).toBeUndefined();
    });

    it('should update when sphere changes', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      sphere.attach(warehouse);
      
      sphere.setRadius(10);
      
      const characteristics = warehouse.getCharacteristics('sphere-1');
      expect(characteristics?.area).toBeCloseTo(1256.637, 2);
      expect(characteristics?.volume).toBeCloseTo(4188.790, 2);
    });

    it('should update when triangle changes', () => {
      const triangle = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0)
      );
      triangle.attach(warehouse);
      
      triangle.setPointB(new Point(6, 0, 0));
      
      const characteristics = warehouse.getCharacteristics('triangle-1');
      expect(characteristics?.area).toBeCloseTo(12, 2);
    });
  });

  describe('Characteristics Management', () => {
    it('should remove characteristics', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      sphere.attach(warehouse);
      warehouse.update(sphere);
      
      warehouse.removeCharacteristics('sphere-1');
      
      const characteristics = warehouse.getCharacteristics('sphere-1');
      expect(characteristics).toBeUndefined();
    });

    it('should return all characteristics', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      const triangle = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0)
      );
      
      sphere.attach(warehouse);
      triangle.attach(warehouse);
      warehouse.update(sphere);
      warehouse.update(triangle);
      
      const allCharacteristics = warehouse.getAllCharacteristics();
      
      expect(allCharacteristics.size).toBe(2);
      expect(allCharacteristics.has('sphere-1')).toBe(true);
      expect(allCharacteristics.has('triangle-1')).toBe(true);
    });

    it('should clear all characteristics', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      sphere.attach(warehouse);
      warehouse.update(sphere);
      
      warehouse.clear();
      
      const allCharacteristics = warehouse.getAllCharacteristics();
      expect(allCharacteristics.size).toBe(0);
    });
  });
});
