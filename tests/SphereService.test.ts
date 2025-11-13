import { Point } from '../src/entities/Point';
import { Sphere } from '../src/entities/Sphere';
import { SphereService } from '../src/services/SphereService';

describe('SphereService', () => {
  let service: SphereService;

  beforeEach(() => {
    service = new SphereService();
  });

  describe('calculateSurfaceArea', () => {
    test('should calculate surface area for sphere with radius 1', () => {
      const sphere = new Sphere('1', 'Unit Sphere', new Point(0, 0, 0), 1);

      const area = service.calculateSurfaceArea(sphere);

      expect(area).toBeCloseTo(4 * Math.PI, 5);
      expect(area).toBeGreaterThan(0);
      expect(Number.isFinite(area)).toBe(true);
    });

    test('should calculate surface area for sphere with radius 5', () => {
      const sphere = new Sphere('2', 'Large Sphere', new Point(1, 2, 3), 5);

      const area = service.calculateSurfaceArea(sphere);

      expect(area).toBeCloseTo(4 * Math.PI * 25, 5);
      expect(area).toBeGreaterThan(0);
      expect(Number.isFinite(area)).toBe(true);
    });

    test('should calculate surface area for sphere with decimal radius', () => {
      const sphere = new Sphere('3', 'Decimal Sphere', new Point(0, 0, 0), 2.5);

      const area = service.calculateSurfaceArea(sphere);

      expect(area).toBeCloseTo(4 * Math.PI * 6.25, 5);
      expect(area).toBeGreaterThan(0);
    });
  });

  describe('calculateVolume', () => {
    test('should calculate volume for sphere with radius 1', () => {
      const sphere = new Sphere('1', 'Unit Sphere', new Point(0, 0, 0), 1);

      const volume = service.calculateVolume(sphere);

      expect(volume).toBeCloseTo((4 / 3) * Math.PI, 5);
      expect(volume).toBeGreaterThan(0);
      expect(Number.isFinite(volume)).toBe(true);
    });

    test('should calculate volume for sphere with radius 3', () => {
      const sphere = new Sphere('2', 'Medium Sphere', new Point(0, 0, 0), 3);

      const volume = service.calculateVolume(sphere);

      expect(volume).toBeCloseTo((4 / 3) * Math.PI * 27, 5);
      expect(volume).toBeGreaterThan(0);
      expect(Number.isFinite(volume)).toBe(true);
    });

    test('should calculate volume for sphere with decimal radius', () => {
      const sphere = new Sphere('3', 'Decimal Sphere', new Point(5, 5, 5), 1.5);

      const volume = service.calculateVolume(sphere);

      expect(volume).toBeCloseTo((4 / 3) * Math.PI * 3.375, 5);
      expect(volume).toBeGreaterThan(0);
    });
  });

  describe('isSphere', () => {
    test('should return true for valid sphere', () => {
      const sphere = new Sphere('1', 'Valid Sphere', new Point(0, 0, 0), 5);

      const isValid = service.isSphere(sphere);

      expect(isValid).toBe(true);
      expect(typeof isValid).toBe('boolean');
    });

    test('should return true for sphere with decimal radius', () => {
      const sphere = new Sphere('2', 'Decimal Sphere', new Point(1, 2, 3), 4.5);

      const isValid = service.isSphere(sphere);

      expect(isValid).toBe(true);
      expect(typeof isValid).toBe('boolean');
    });

    test('should return true for sphere with large radius', () => {
      const sphere = new Sphere('3', 'Large Sphere', new Point(-5, -5, -5), 1000);

      const isValid = service.isSphere(sphere);

      expect(isValid).toBe(true);
    });
  });

  describe('touchesXYPlane', () => {
    test('should return true when sphere touches XY plane from above', () => {
      const sphere = new Sphere('1', 'Touching XY', new Point(0, 0, 3), 3);

      const touches = service.touchesXYPlane(sphere);

      expect(touches).toBe(true);
      expect(typeof touches).toBe('boolean');
    });

    test('should return true when sphere touches XY plane from below', () => {
      const sphere = new Sphere('2', 'Touching XY Below', new Point(5, 5, -4), 4);

      const touches = service.touchesXYPlane(sphere);

      expect(touches).toBe(true);
      expect(typeof touches).toBe('boolean');
    });

    test('should return false when sphere does not touch XY plane', () => {
      const sphere = new Sphere('3', 'Not Touching XY', new Point(0, 0, 10), 3);

      const touches = service.touchesXYPlane(sphere);

      expect(touches).toBe(false);
      expect(typeof touches).toBe('boolean');
    });

    test('should return false when sphere intersects but does not touch XY plane', () => {
      const sphere = new Sphere('4', 'Intersecting XY', new Point(0, 0, 2), 5);

      const touches = service.touchesXYPlane(sphere);

      expect(touches).toBe(false);
    });
  });

  describe('touchesXZPlane', () => {
    test('should return true when sphere touches XZ plane', () => {
      const sphere = new Sphere('1', 'Touching XZ', new Point(0, 3, 0), 3);

      const touches = service.touchesXZPlane(sphere);

      expect(touches).toBe(true);
      expect(typeof touches).toBe('boolean');
    });

    test('should return false when sphere does not touch XZ plane', () => {
      const sphere = new Sphere('2', 'Not Touching XZ', new Point(0, 10, 0), 3);

      const touches = service.touchesXZPlane(sphere);

      expect(touches).toBe(false);
      expect(typeof touches).toBe('boolean');
    });
  });

  describe('touchesYZPlane', () => {
    test('should return true when sphere touches YZ plane', () => {
      const sphere = new Sphere('1', 'Touching YZ', new Point(4, 0, 0), 4);

      const touches = service.touchesYZPlane(sphere);

      expect(touches).toBe(true);
      expect(typeof touches).toBe('boolean');
    });

    test('should return false when sphere does not touch YZ plane', () => {
      const sphere = new Sphere('2', 'Not Touching YZ', new Point(10, 0, 0), 3);

      const touches = service.touchesYZPlane(sphere);

      expect(touches).toBe(false);
      expect(typeof touches).toBe('boolean');
    });
  });

  describe('touchesAnyCoordinatePlane', () => {
    test('should return true when sphere touches XY plane', () => {
      const sphere = new Sphere('1', 'Touching XY', new Point(0, 0, 3), 3);

      const touches = service.touchesAnyCoordinatePlane(sphere);

      expect(touches).toBe(true);
      expect(typeof touches).toBe('boolean');
    });

    test('should return true when sphere touches XZ plane', () => {
      const sphere = new Sphere('2', 'Touching XZ', new Point(0, 5, 0), 5);

      const touches = service.touchesAnyCoordinatePlane(sphere);

      expect(touches).toBe(true);
      expect(typeof touches).toBe('boolean');
    });

    test('should return true when sphere touches YZ plane', () => {
      const sphere = new Sphere('3', 'Touching YZ', new Point(2, 0, 0), 2);

      const touches = service.touchesAnyCoordinatePlane(sphere);

      expect(touches).toBe(true);
    });

    test('should return false when sphere does not touch any plane', () => {
      const sphere = new Sphere('4', 'Not Touching', new Point(10, 10, 10), 3);

      const touches = service.touchesAnyCoordinatePlane(sphere);

      expect(touches).toBe(false);
      expect(typeof touches).toBe('boolean');
    });
  });

  describe('calculateVolumeRatioXY', () => {
    test('should return 0.5 when center is on XY plane', () => {
      const sphere = new Sphere('1', 'On XY Plane', new Point(0, 0, 0), 5);

      const ratio = service.calculateVolumeRatioXY(sphere);

      expect(ratio).toBeCloseTo(0.5, 5);
      expect(ratio).toBeGreaterThanOrEqual(0);
      expect(ratio).toBeLessThanOrEqual(1);
    });

    test('should return 0 when plane does not intersect sphere', () => {
      const sphere = new Sphere('2', 'Above XY Plane', new Point(0, 0, 10), 3);

      const ratio = service.calculateVolumeRatioXY(sphere);

      expect(ratio).toBe(0);
      expect(ratio).toBeGreaterThanOrEqual(0);
      expect(ratio).toBeLessThanOrEqual(1);
    });

    test('should calculate valid ratio for off-center sphere', () => {
      const sphere = new Sphere('3', 'Off-center', new Point(0, 0, 2), 5);

      const ratio = service.calculateVolumeRatioXY(sphere);

      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThan(1);
      expect(Number.isFinite(ratio)).toBe(true);
    });

    test('should return value between 0 and 1', () => {
      const sphere = new Sphere('4', 'Test Sphere', new Point(1, 2, 3), 4);

      const ratio = service.calculateVolumeRatioXY(sphere);

      expect(ratio).toBeGreaterThanOrEqual(0);
      expect(ratio).toBeLessThanOrEqual(1);
      expect(Number.isFinite(ratio)).toBe(true);
    });
  });

  describe('calculateVolumeRatioXZ', () => {
    test('should return 0.5 when center is on XZ plane', () => {
      const sphere = new Sphere('1', 'On XZ Plane', new Point(0, 0, 0), 5);

      const ratio = service.calculateVolumeRatioXZ(sphere);

      expect(ratio).toBeCloseTo(0.5, 5);
      expect(ratio).toBeGreaterThanOrEqual(0);
      expect(ratio).toBeLessThanOrEqual(1);
    });

    test('should return 0 when plane does not intersect sphere', () => {
      const sphere = new Sphere('2', 'Away from XZ', new Point(0, 10, 0), 3);

      const ratio = service.calculateVolumeRatioXZ(sphere);

      expect(ratio).toBe(0);
      expect(ratio).toBeGreaterThanOrEqual(0);
    });

    test('should calculate valid ratio for off-center sphere', () => {
      const sphere = new Sphere('3', 'Off-center XZ', new Point(0, 1, 0), 3);

      const ratio = service.calculateVolumeRatioXZ(sphere);

      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThan(1);
      expect(Number.isFinite(ratio)).toBe(true);
    });
  });

  describe('calculateVolumeRatioYZ', () => {
    test('should return 0.5 when center is on YZ plane', () => {
      const sphere = new Sphere('1', 'On YZ Plane', new Point(0, 0, 0), 5);

      const ratio = service.calculateVolumeRatioYZ(sphere);

      expect(ratio).toBeCloseTo(0.5, 5);
      expect(ratio).toBeGreaterThanOrEqual(0);
      expect(ratio).toBeLessThanOrEqual(1);
    });

    test('should return 0 when plane does not intersect sphere', () => {
      const sphere = new Sphere('2', 'Away from YZ', new Point(10, 0, 0), 3);

      const ratio = service.calculateVolumeRatioYZ(sphere);

      expect(ratio).toBe(0);
      expect(ratio).toBeGreaterThanOrEqual(0);
      expect(ratio).toBeLessThanOrEqual(1);
    });

    test('should calculate valid ratio for off-center sphere', () => {
      const sphere = new Sphere('3', 'Off-center YZ', new Point(2, 0, 0), 4);

      const ratio = service.calculateVolumeRatioYZ(sphere);

      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThan(1);
      expect(Number.isFinite(ratio)).toBe(true);
    });
  });
});
