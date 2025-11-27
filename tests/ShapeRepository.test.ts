import { ShapeRepository } from '../src/repositories/ShapeRepository';
import { MutableSphere } from '../src/entities/MutableSphere';
import { MutableTriangle } from '../src/entities/MutableTriangle';
import { Point } from '../src/entities/Point';
import { Warehouse } from '../src/warehouse/Warehouse';
import { ShapeByIdSpecification } from '../src/specifications/ShapeByIdSpecification';
import { ShapeByNameSpecification } from '../src/specifications/ShapeByNameSpecification';
import { ShapeInFirstQuadrantSpecification } from '../src/specifications/ShapeInFirstQuadrantSpecification';
import { ShapeByDistanceRangeSpecification } from '../src/specifications/ShapeByDistanceRangeSpecification';
import { ShapeByAreaRangeSpecification } from '../src/specifications/ShapeByAreaRangeSpecification';
import { ShapeByVolumeRangeSpecification } from '../src/specifications/ShapeByVolumeRangeSpecification';
import { ShapeIdComparator } from '../src/comparators/ShapeIdComparator';
import { ShapeNameComparator } from '../src/comparators/ShapeNameComparator';
import { ShapeByFirstPointXComparator } from '../src/comparators/ShapeByFirstPointXComparator';
import { ShapeByFirstPointYComparator } from '../src/comparators/ShapeByFirstPointYComparator';

describe('ShapeRepository', () => {
  let repository: ShapeRepository;
  let warehouse: Warehouse;

  beforeEach(() => {
    repository = new ShapeRepository();
    warehouse = Warehouse.getInstance();
    warehouse.clear();
  });

  describe('CRUD Operations', () => {
    it('should add a shape to the repository', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      
      repository.add(sphere);
      
      expect(repository.size()).toBe(1);
      expect(repository.findById('sphere-1')).toBe(sphere);
    });

    it('should remove a shape from the repository', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      repository.add(sphere);
      
      const result = repository.remove('sphere-1');
      
      expect(result).toBe(true);
      expect(repository.size()).toBe(0);
      expect(repository.findById('sphere-1')).toBeUndefined();
    });

    it('should return false when removing non-existent shape', () => {
      const result = repository.remove('non-existent');
      
      expect(result).toBe(false);
    });

    it('should find all shapes', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      const triangle = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0)
      );
      
      repository.add(sphere);
      repository.add(triangle);
      
      const shapes = repository.findAll();
      
      expect(shapes.length).toBe(2);
      expect(shapes).toContain(sphere);
      expect(shapes).toContain(triangle);
    });

    it('should clear all shapes', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      const triangle = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0)
      );
      
      repository.add(sphere);
      repository.add(triangle);
      repository.clear();
      
      expect(repository.size()).toBe(0);
    });
  });

  describe('Specification Pattern', () => {
    it('should find shape by ID', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      const triangle = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0)
      );
      
      repository.add(sphere);
      repository.add(triangle);
      
      const spec = new ShapeByIdSpecification('sphere-1');
      const results = repository.findBySpecification(spec);
      
      expect(results.length).toBe(1);
      expect(results[0]).toBe(sphere);
    });

    it('should find shape by name', () => {
      const sphere = new MutableSphere('sphere-1', 'TestSphere', new Point(0, 0, 0), 5);
      const triangle = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0)
      );
      
      repository.add(sphere);
      repository.add(triangle);
      
      const spec = new ShapeByNameSpecification('TestSphere');
      const results = repository.findBySpecification(spec);
      
      expect(results.length).toBe(1);
      expect(results[0]).toBe(sphere);
    });

    it('should find shapes in first quadrant', () => {
      const sphereInQuadrant = new MutableSphere('sphere-1', 'Sphere1', new Point(1, 2, 3), 5);
      const sphereOutQuadrant = new MutableSphere('sphere-2', 'Sphere2', new Point(-1, 2, 3), 5);
      const triangleInQuadrant = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(1, 1, 1),
        new Point(3, 2, 1),
        new Point(2, 4, 1)
      );
      
      repository.add(sphereInQuadrant);
      repository.add(sphereOutQuadrant);
      repository.add(triangleInQuadrant);
      
      const spec = new ShapeInFirstQuadrantSpecification();
      const results = repository.findBySpecification(spec);
      
      expect(results.length).toBe(2);
      expect(results).toContain(sphereInQuadrant);
      expect(results).toContain(triangleInQuadrant);
    });

    it('should find shapes by distance range from origin', () => {
      const sphereNear = new MutableSphere('sphere-1', 'Sphere1', new Point(1, 1, 1), 5);
      const sphereFar = new MutableSphere('sphere-2', 'Sphere2', new Point(10, 10, 10), 5);
      
      repository.add(sphereNear);
      repository.add(sphereFar);
      
      const spec = new ShapeByDistanceRangeSpecification(0, 5);
      const results = repository.findBySpecification(spec);
      
      expect(results.length).toBe(1);
      expect(results[0]).toBe(sphereNear);
    });

    it('should find shapes by area range', () => {
      const smallSphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 1);
      const largeSphere = new MutableSphere('sphere-2', 'Sphere2', new Point(0, 0, 0), 10);
      
      repository.add(smallSphere);
      repository.add(largeSphere);
      
      const smallArea = smallSphere.calculateArea();
      const spec = new ShapeByAreaRangeSpecification(0, smallArea + 1);
      const results = repository.findBySpecification(spec);
      
      expect(results.length).toBe(1);
      expect(results[0]).toBe(smallSphere);
    });

    it('should find shapes by volume range', () => {
      const smallSphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 1);
      const largeSphere = new MutableSphere('sphere-2', 'Sphere2', new Point(0, 0, 0), 10);
      
      repository.add(smallSphere);
      repository.add(largeSphere);
      
      const smallVolume = smallSphere.calculateVolume();
      const spec = new ShapeByVolumeRangeSpecification(0, smallVolume + 1);
      const results = repository.findBySpecification(spec);
      
      expect(results.length).toBe(1);
      expect(results[0]).toBe(smallSphere);
    });

    it('should combine specifications with AND', () => {
      const sphere = new MutableSphere('sphere-1', 'TestSphere', new Point(1, 1, 1), 5);
      repository.add(sphere);
      
      const idSpec = new ShapeByIdSpecification('sphere-1');
      const nameSpec = new ShapeByNameSpecification('TestSphere');
      const combinedSpec = idSpec.and(nameSpec);
      
      const results = repository.findBySpecification(combinedSpec);
      
      expect(results.length).toBe(1);
      expect(results[0]).toBe(sphere);
    });

    it('should combine specifications with OR', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      const triangle = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0)
      );
      
      repository.add(sphere);
      repository.add(triangle);
      
      const idSpec1 = new ShapeByIdSpecification('sphere-1');
      const idSpec2 = new ShapeByIdSpecification('triangle-1');
      const combinedSpec = idSpec1.or(idSpec2);
      
      const results = repository.findBySpecification(combinedSpec);
      
      expect(results.length).toBe(2);
    });
  });

  describe('Sorting with Comparators', () => {
    it('should sort shapes by ID', () => {
      const sphere1 = new MutableSphere('c-sphere', 'Sphere1', new Point(0, 0, 0), 5);
      const sphere2 = new MutableSphere('a-sphere', 'Sphere2', new Point(0, 0, 0), 3);
      const sphere3 = new MutableSphere('b-sphere', 'Sphere3', new Point(0, 0, 0), 7);
      
      repository.add(sphere1);
      repository.add(sphere2);
      repository.add(sphere3);
      
      const sorted = repository.sort(ShapeIdComparator.compare);
      
      expect(sorted[0].getId()).toBe('a-sphere');
      expect(sorted[1].getId()).toBe('b-sphere');
      expect(sorted[2].getId()).toBe('c-sphere');
    });

    it('should sort shapes by name', () => {
      const sphere1 = new MutableSphere('sphere-1', 'Charlie', new Point(0, 0, 0), 5);
      const sphere2 = new MutableSphere('sphere-2', 'Alpha', new Point(0, 0, 0), 3);
      const sphere3 = new MutableSphere('sphere-3', 'Bravo', new Point(0, 0, 0), 7);
      
      repository.add(sphere1);
      repository.add(sphere2);
      repository.add(sphere3);
      
      const sorted = repository.sort(ShapeNameComparator.compare);
      
      expect(sorted[0].getName()).toBe('Alpha');
      expect(sorted[1].getName()).toBe('Bravo');
      expect(sorted[2].getName()).toBe('Charlie');
    });

    it('should sort shapes by first point X coordinate', () => {
      const sphere1 = new MutableSphere('sphere-1', 'Sphere1', new Point(5, 0, 0), 5);
      const sphere2 = new MutableSphere('sphere-2', 'Sphere2', new Point(1, 0, 0), 3);
      const sphere3 = new MutableSphere('sphere-3', 'Sphere3', new Point(3, 0, 0), 7);
      
      repository.add(sphere1);
      repository.add(sphere2);
      repository.add(sphere3);
      
      const sorted = repository.sort(ShapeByFirstPointXComparator.compare);
      
      expect((sorted[0] as MutableSphere).getCenter().getX()).toBe(1);
      expect((sorted[1] as MutableSphere).getCenter().getX()).toBe(3);
      expect((sorted[2] as MutableSphere).getCenter().getX()).toBe(5);
    });

    it('should sort shapes by first point Y coordinate', () => {
      const sphere1 = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 5, 0), 5);
      const sphere2 = new MutableSphere('sphere-2', 'Sphere2', new Point(0, 1, 0), 3);
      const sphere3 = new MutableSphere('sphere-3', 'Sphere3', new Point(0, 3, 0), 7);
      
      repository.add(sphere1);
      repository.add(sphere2);
      repository.add(sphere3);
      
      const sorted = repository.sort(ShapeByFirstPointYComparator.compare);
      
      expect((sorted[0] as MutableSphere).getCenter().getY()).toBe(1);
      expect((sorted[1] as MutableSphere).getCenter().getY()).toBe(3);
      expect((sorted[2] as MutableSphere).getCenter().getY()).toBe(5);
    });
  });

  describe('Warehouse Integration', () => {
    it('should store characteristics when shape is added', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      
      repository.add(sphere);
      
      const characteristics = warehouse.getCharacteristics('sphere-1');
      expect(characteristics).toBeDefined();
      expect(characteristics?.area).toBeCloseTo(314.159, 2);
      expect(characteristics?.volume).toBeCloseTo(523.598, 2);
    });

    it('should update characteristics when shape changes', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      repository.add(sphere);
      
      sphere.setRadius(10);
      
      const characteristics = warehouse.getCharacteristics('sphere-1');
      expect(characteristics?.area).toBeCloseTo(1256.637, 2);
      expect(characteristics?.volume).toBeCloseTo(4188.790, 2);
    });

    it('should remove characteristics when shape is removed', () => {
      const sphere = new MutableSphere('sphere-1', 'Sphere1', new Point(0, 0, 0), 5);
      repository.add(sphere);
      
      repository.remove('sphere-1');
      
      const characteristics = warehouse.getCharacteristics('sphere-1');
      expect(characteristics).toBeUndefined();
    });

    it('should store triangle characteristics', () => {
      const triangle = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0)
      );
      
      repository.add(triangle);
      
      const characteristics = warehouse.getCharacteristics('triangle-1');
      expect(characteristics).toBeDefined();
      expect(characteristics?.area).toBeCloseTo(6, 2);
      expect(characteristics?.perimeter).toBe(12);
    });

    it('should update triangle characteristics when points change', () => {
      const triangle = new MutableTriangle(
        'triangle-1',
        'Triangle1',
        new Point(0, 0, 0),
        new Point(3, 0, 0),
        new Point(0, 4, 0)
      );
      repository.add(triangle);
      
      triangle.setPointB(new Point(6, 0, 0));
      
      const characteristics = warehouse.getCharacteristics('triangle-1');
      expect(characteristics?.area).toBeCloseTo(12, 2);
    });
  });
});
