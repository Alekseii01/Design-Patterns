import { TriangleFactory } from '../src/factories/TriangleFactory';
import { Triangle } from '../src/entities/Triangle';
import { ShapeCreationException } from '../src/exceptions/ShapeCreationException';

describe('TriangleFactory', () => {
  let factory: TriangleFactory;

  beforeEach(() => {
    factory = new TriangleFactory();
  });

  describe('createShape', () => {
    test('should create valid triangle from correct data', () => {
      const data = [0, 0, 0, 3, 0, 0, 0, 4, 0];

      const triangle = factory.createShape('1', 'Test Triangle', data);

      expect(triangle).toBeInstanceOf(Triangle);
      expect(triangle.getId()).toBe('1');
      expect(triangle.getName()).toBe('Test Triangle');
      expect(triangle.getPointA().getX()).toBe(0);
      expect(triangle.getPointB().getX()).toBe(3);
      expect(triangle.getPointC().getY()).toBe(4);
    });

    test('should create triangle with negative coordinates', () => {
      const data = [-1, -1, 0, 2, -1, 0, 0.5, 2, 0];

      const triangle = factory.createShape('2', 'Negative Triangle', data);

      expect(triangle).toBeInstanceOf(Triangle);
      expect(triangle.getPointA().getX()).toBe(-1);
      expect(triangle.getPointA().getY()).toBe(-1);
    });

    test('should create 3D triangle', () => {
      const data = [0, 0, 0, 1, 0, 0, 0, 1, 1];

      const triangle = factory.createShape('3', '3D Triangle', data);

      expect(triangle).toBeInstanceOf(Triangle);
      expect(triangle.getPointC().getZ()).toBe(1);
      expect(triangle.getId()).toBe('3');
    });

    test('should throw error for insufficient parameters', () => {
      const data = [0, 0, 0, 1, 0];

      expect(() => factory.createShape('4', 'Invalid', data)).toThrow(ShapeCreationException);
      expect(() => factory.createShape('4', 'Invalid', data)).toThrow(/parameter count/i);
    });

    test('should throw error for too many parameters', () => {
      const data = [0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 2, 3];

      expect(() => factory.createShape('5', 'Invalid', data)).toThrow(ShapeCreationException);
      expect(() => factory.createShape('5', 'Invalid', data)).toThrow(/parameter count/i);
    });

    test('should throw error for collinear points', () => {
      const data = [0, 0, 0, 1, 0, 0, 2, 0, 0];

      expect(() => factory.createShape('6', 'Collinear', data)).toThrow(ShapeCreationException);
      expect(() => factory.createShape('6', 'Collinear', data)).toThrow(/Cannot create triangle/i);
    });

    test('should throw error for duplicate points', () => {
      const data = [0, 0, 0, 0, 0, 0, 1, 1, 1];

      expect(() => factory.createShape('7', 'Duplicate', data)).toThrow(ShapeCreationException);
    });

    test('should throw error for very close points', () => {
      const data = [0, 0, 0, 0.0000001, 0, 0, 0, 0.0000001, 0];

      expect(() => factory.createShape('8', 'Too Close', data)).toThrow(ShapeCreationException);
      expect(() => factory.createShape('8', 'Too Close', data)).toThrow(/Cannot create triangle/i);
    });
  });
});
