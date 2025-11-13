import { Point } from '../src/entities/Point';
import { Triangle } from '../src/entities/Triangle';
import { TriangleService } from '../src/services/TriangleService';

describe('TriangleService', () => {
  let service: TriangleService;

  beforeEach(() => {
    service = new TriangleService();
  });

  describe('calculatePerimeter', () => {
    test('should calculate perimeter for 3-4-5 right triangle', () => {
      const triangle = new Triangle(
        '1',
        'Right Triangle',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );

      const perimeter = service.calculatePerimeter(triangle);

      expect(perimeter).toBeCloseTo(12, 5);
      expect(perimeter).toBeGreaterThan(0);
      expect(Number.isFinite(perimeter)).toBe(true);
    });

    test('should calculate perimeter for equilateral triangle', () => {
      const triangle = new Triangle(
        '2',
        'Equilateral',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0.5, Math.sqrt(3) / 2, 0),
      );

      const perimeter = service.calculatePerimeter(triangle);

      expect(perimeter).toBeCloseTo(3, 5);
      expect(perimeter).toBeGreaterThan(0);
    });

    test('should calculate perimeter for isosceles triangle', () => {
      const triangle = new Triangle(
        '3',
        'Isosceles',
        new Point(0, 0, 0),
        new Point(4, 0, 0),
        new Point(2, 3, 0),
      );

      const perimeter = service.calculatePerimeter(triangle);

      expect(perimeter).toBeGreaterThan(0);
      expect(Number.isFinite(perimeter)).toBe(true);
    });
  });

  describe('calculateArea', () => {
    test('should calculate area for 3-4-5 right triangle', () => {
      const triangle = new Triangle(
        '1',
        'Right Triangle',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );

      const area = service.calculateArea(triangle);

      expect(area).toBeCloseTo(6, 5);
      expect(area).toBeGreaterThan(0);
      expect(Number.isFinite(area)).toBe(true);
    });

    test('should calculate area for equilateral triangle with side 1', () => {
      const triangle = new Triangle(
        '2',
        'Equilateral',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0.5, Math.sqrt(3) / 2, 0),
      );

      const area = service.calculateArea(triangle);

      expect(area).toBeCloseTo(Math.sqrt(3) / 4, 5);
      expect(area).toBeGreaterThan(0);
    });

    test('should calculate area for 3D triangle', () => {
      const triangle = new Triangle(
        '3',
        '3D Triangle',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0, 1, 1),
      );

      const area = service.calculateArea(triangle);

      expect(area).toBeGreaterThan(0);
      expect(Number.isFinite(area)).toBe(true);
    });
  });

  describe('isRightTriangle', () => {
    test('should identify 3-4-5 right triangle', () => {
      const triangle = new Triangle(
        '1',
        'Right Triangle',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );

      const isRight = service.isRightTriangle(triangle);

      expect(isRight).toBe(true);
      expect(typeof isRight).toBe('boolean');
    });

    test('should identify 5-12-13 right triangle', () => {
      const triangle = new Triangle(
        '2',
        'Right Triangle 2',
        new Point(0, 0, 0),
        new Point(5, 0, 0),
        new Point(0, 12, 0),
      );

      const isRight = service.isRightTriangle(triangle);

      expect(isRight).toBe(true);
    });

    test('should return false for equilateral triangle', () => {
      const triangle = new Triangle(
        '3',
        'Equilateral',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0.5, Math.sqrt(3) / 2, 0),
      );

      const isRight = service.isRightTriangle(triangle);

      expect(isRight).toBe(false);
      expect(typeof isRight).toBe('boolean');
    });

    test('should return false for acute triangle', () => {
      const triangle = new Triangle(
        '4',
        'Acute',
        new Point(0, 0, 0),
        new Point(2, 0, 0),
        new Point(1, 1.5, 0),
      );

      const isRight = service.isRightTriangle(triangle);

      expect(isRight).toBe(false);
    });
  });

  describe('isIsosceles', () => {
    test('should identify isosceles triangle', () => {
      const triangle = new Triangle(
        '1',
        'Isosceles',
        new Point(0, 0, 0),
        new Point(4, 0, 0),
        new Point(2, 3, 0),
      );

      const isIsosceles = service.isIsosceles(triangle);

      expect(isIsosceles).toBe(true);
      expect(typeof isIsosceles).toBe('boolean');
    });

    test('should identify equilateral as isosceles', () => {
      const triangle = new Triangle(
        '2',
        'Equilateral',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0.5, Math.sqrt(3) / 2, 0),
      );

      const isIsosceles = service.isIsosceles(triangle);

      expect(isIsosceles).toBe(true);
    });

    test('should return false for scalene triangle', () => {
      const triangle = new Triangle(
        '3',
        'Scalene',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );

      const isIsosceles = service.isIsosceles(triangle);

      expect(isIsosceles).toBe(false);
      expect(typeof isIsosceles).toBe('boolean');
    });
  });

  describe('isEquilateral', () => {
    test('should identify equilateral triangle', () => {
      const triangle = new Triangle(
        '1',
        'Equilateral',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0.5, Math.sqrt(3) / 2, 0),
      );

      const isEquilateral = service.isEquilateral(triangle);

      expect(isEquilateral).toBe(true);
      expect(typeof isEquilateral).toBe('boolean');
    });

    test('should return false for isosceles triangle', () => {
      const triangle = new Triangle(
        '2',
        'Isosceles',
        new Point(0, 0, 0),
        new Point(4, 0, 0),
        new Point(2, 3, 0),
      );

      const isEquilateral = service.isEquilateral(triangle);

      expect(isEquilateral).toBe(false);
      expect(typeof isEquilateral).toBe('boolean');
    });

    test('should return false for right triangle', () => {
      const triangle = new Triangle(
        '3',
        'Right',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );

      const isEquilateral = service.isEquilateral(triangle);

      expect(isEquilateral).toBe(false);
    });
  });

  describe('isAcute', () => {
    test('should identify acute triangle', () => {
      const triangle = new Triangle(
        '1',
        'Acute',
        new Point(0, 0, 0),
        new Point(2, 0, 0),
        new Point(1, 1.5, 0),
      );

      const isAcute = service.isAcute(triangle);

      expect(isAcute).toBe(true);
      expect(typeof isAcute).toBe('boolean');
    });

    test('should return false for right triangle', () => {
      const triangle = new Triangle(
        '2',
        'Right',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );

      const isAcute = service.isAcute(triangle);

      expect(isAcute).toBe(false);
    });

    test('should identify equilateral as acute', () => {
      const triangle = new Triangle(
        '3',
        'Equilateral',
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0.5, Math.sqrt(3) / 2, 0),
      );

      const isAcute = service.isAcute(triangle);

      expect(isAcute).toBe(true);
      expect(typeof isAcute).toBe('boolean');
    });
  });

  describe('isObtuse', () => {
    test('should identify obtuse triangle', () => {
      const triangle = new Triangle(
        '1',
        'Obtuse',
        new Point(0, 0, 0),
        new Point(5, 0, 0),
        new Point(1, 1, 0),
      );

      const isObtuse = service.isObtuse(triangle);

      expect(isObtuse).toBe(true);
      expect(typeof isObtuse).toBe('boolean');
    });

    test('should return false for right triangle', () => {
      const triangle = new Triangle(
        '2',
        'Right',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0),
      );

      const isObtuse = service.isObtuse(triangle);

      expect(isObtuse).toBe(false);
    });

    test('should return false for acute triangle', () => {
      const triangle = new Triangle(
        '3',
        'Acute',
        new Point(0, 0, 0),
        new Point(2, 0, 0),
        new Point(1, 1.5, 0),
      );

      const isObtuse = service.isObtuse(triangle);

      expect(isObtuse).toBe(false);
      expect(typeof isObtuse).toBe('boolean');
    });
  });

  describe('isValidTriangle', () => {
    test('should validate correct triangle points', () => {
      const isValid = service.isValidTriangle(
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(0, 1, 0),
      );

      expect(isValid).toBe(true);
      expect(typeof isValid).toBe('boolean');
    });

    test('should reject collinear points', () => {
      const isValid = service.isValidTriangle(
        new Point(0, 0, 0),
        new Point(1, 0, 0),
        new Point(2, 0, 0),
      );

      expect(isValid).toBe(false);
      expect(typeof isValid).toBe('boolean');
    });

    test('should reject duplicate points', () => {
      const isValid = service.isValidTriangle(
        new Point(0, 0, 0),
        new Point(0, 0, 0),
        new Point(1, 1, 1),
      );

      expect(isValid).toBe(false);
    });

    test('should reject very close points', () => {
      const isValid = service.isValidTriangle(
        new Point(0, 0, 0),
        new Point(0.0000001, 0, 0),
        new Point(0, 0.0000001, 0),
      );

      expect(isValid).toBe(false);
      expect(typeof isValid).toBe('boolean');
    });
  });
});
