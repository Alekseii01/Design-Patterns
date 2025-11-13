import { PointValidator } from '../src/validators/PointValidator';
import { ValidationException } from '../src/exceptions/ValidationException';

describe('PointValidator', () => {
  let validator: PointValidator;

  beforeEach(() => {
    validator = new PointValidator();
  });

  describe('validateCoordinate', () => {
    test('should accept valid positive number', () => {
      expect(() => validator.validateCoordinate(5.5)).not.toThrow();
      expect(() => validator.validateCoordinate(100)).not.toThrow();
    });

    test('should accept valid negative number', () => {
      expect(() => validator.validateCoordinate(-5.5)).not.toThrow();
      expect(() => validator.validateCoordinate(-100)).not.toThrow();
    });

    test('should accept zero', () => {
      expect(() => validator.validateCoordinate(0)).not.toThrow();
    });

    test('should reject NaN', () => {
      expect(() => validator.validateCoordinate(Number.NaN)).toThrow(ValidationException);
      expect(() => validator.validateCoordinate(Number.NaN)).toThrow('Coordinate must be a valid finite number');
    });

    test('should reject Infinity', () => {
      expect(() => validator.validateCoordinate(Number.POSITIVE_INFINITY)).toThrow(ValidationException);
      expect(() => validator.validateCoordinate(Number.NEGATIVE_INFINITY)).toThrow(ValidationException);
    });
  });

  describe('validatePoint', () => {
    test('should accept valid 3D point', () => {
      expect(() => validator.validatePoint(1, 2, 3)).not.toThrow();
      expect(() => validator.validatePoint(-1, -2, -3)).not.toThrow();
      expect(() => validator.validatePoint(0, 0, 0)).not.toThrow();
    });

    test('should accept valid 2D point with default z', () => {
      expect(() => validator.validatePoint(1, 2)).not.toThrow();
      expect(() => validator.validatePoint(-1, -2)).not.toThrow();
    });

    test('should reject point with NaN coordinate', () => {
      expect(() => validator.validatePoint(Number.NaN, 2, 3)).toThrow(ValidationException);
      expect(() => validator.validatePoint(1, Number.NaN, 3)).toThrow(ValidationException);
      expect(() => validator.validatePoint(1, 2, Number.NaN)).toThrow(ValidationException);
    });

    test('should reject point with infinite coordinate', () => {
      expect(() => validator.validatePoint(Number.POSITIVE_INFINITY, 2, 3)).toThrow(ValidationException);
      expect(() => validator.validatePoint(1, Number.NEGATIVE_INFINITY, 3)).toThrow(ValidationException);
    });
  });
});
