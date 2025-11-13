import { SphereFactory } from '../src/factories/SphereFactory';
import { Sphere } from '../src/entities/Sphere';
import { ShapeCreationException } from '../src/exceptions/ShapeCreationException';

describe('SphereFactory', () => {
  let factory: SphereFactory;

  beforeEach(() => {
    factory = new SphereFactory();
  });

  describe('createShape', () => {
    test('should create valid sphere from correct data', () => {
      const data = [0, 0, 0, 5];

      const sphere = factory.createShape('1', 'Test Sphere', data);

      expect(sphere).toBeInstanceOf(Sphere);
      expect(sphere.getId()).toBe('1');
      expect(sphere.getName()).toBe('Test Sphere');
      expect(sphere.getCenter().getX()).toBe(0);
      expect(sphere.getRadius()).toBe(5);
    });

    test('should create sphere with negative center coordinates', () => {
      const data = [-5, -10, -15, 3];

      const sphere = factory.createShape('2', 'Negative Center', data);

      expect(sphere).toBeInstanceOf(Sphere);
      expect(sphere.getCenter().getX()).toBe(-5);
      expect(sphere.getCenter().getY()).toBe(-10);
      expect(sphere.getCenter().getZ()).toBe(-15);
      expect(sphere.getRadius()).toBe(3);
    });

    test('should create sphere with decimal values', () => {
      const data = [1.5, 2.5, 3.5, 4.5];

      const sphere = factory.createShape('3', 'Decimal Sphere', data);

      expect(sphere).toBeInstanceOf(Sphere);
      expect(sphere.getCenter().getX()).toBe(1.5);
      expect(sphere.getRadius()).toBe(4.5);
      expect(sphere.getId()).toBe('3');
    });

    test('should throw error for insufficient parameters', () => {
      const data = [0, 0, 0];

      expect(() => factory.createShape('4', 'Invalid', data)).toThrow(ShapeCreationException);
      expect(() => factory.createShape('4', 'Invalid', data)).toThrow(/parameter count/i);
    });

    test('should throw error for too many parameters', () => {
      const data = [0, 0, 0, 5, 6, 7];

      expect(() => factory.createShape('5', 'Invalid', data)).toThrow(ShapeCreationException);
      expect(() => factory.createShape('5', 'Invalid', data)).toThrow(/parameter count/i);
    });

    test('should throw error for negative radius', () => {
      const data = [0, 0, 0, -5];

      expect(() => factory.createShape('6', 'Negative Radius', data)).toThrow(ShapeCreationException);
      expect(() => factory.createShape('6', 'Negative Radius', data)).toThrow(/Cannot create sphere/i);
    });

    test('should throw error for zero radius', () => {
      const data = [0, 0, 0, 0];

      expect(() => factory.createShape('7', 'Zero Radius', data)).toThrow(ShapeCreationException);
      expect(() => factory.createShape('7', 'Zero Radius', data)).toThrow(/Cannot create sphere/i);
    });

    test('should throw error for very small radius', () => {
      const data = [0, 0, 0, 0.0000000001];

      expect(() => factory.createShape('8', 'Tiny Radius', data)).toThrow(ShapeCreationException);
    });
  });
});
