import { Point } from '../src/entities/Point';

describe('Point', () => {
  describe('Constructor and getters', () => {
    test('should create 2D point with default z coordinate', () => {
      const point = new Point(1, 2);

      expect(point.getX()).toBe(1);
      expect(point.getY()).toBe(2);
      expect(point.getZ()).toBe(0);
    });

    test('should create 3D point with all coordinates', () => {
      const point = new Point(1.5, 2.5, 3.5);

      expect(point.getX()).toBe(1.5);
      expect(point.getY()).toBe(2.5);
      expect(point.getZ()).toBe(3.5);
    });

    test('should handle negative coordinates', () => {
      const point = new Point(-1, -2, -3);

      expect(point.getX()).toBe(-1);
      expect(point.getY()).toBe(-2);
      expect(point.getZ()).toBe(-3);
    });

    test('should handle zero coordinates', () => {
      const point = new Point(0, 0, 0);

      expect(point.getX()).toBe(0);
      expect(point.getY()).toBe(0);
      expect(point.getZ()).toBe(0);
    });
  });
});
