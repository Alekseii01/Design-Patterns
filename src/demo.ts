import { ShapeRepository } from './repositories/ShapeRepository';
import { MutableSphere } from './entities/MutableSphere';
import { MutableTriangle } from './entities/MutableTriangle';
import { Point } from './entities/Point';
import { Warehouse } from './warehouse/Warehouse';
import { ShapeByIdSpecification } from './specifications/ShapeByIdSpecification';
import { ShapeByNameSpecification } from './specifications/ShapeByNameSpecification';
import { ShapeInFirstQuadrantSpecification } from './specifications/ShapeInFirstQuadrantSpecification';
import { ShapeByDistanceRangeSpecification } from './specifications/ShapeByDistanceRangeSpecification';
import { ShapeByAreaRangeSpecification } from './specifications/ShapeByAreaRangeSpecification';
import { ShapeByVolumeRangeSpecification } from './specifications/ShapeByVolumeRangeSpecification';
import { ShapeIdComparator } from './comparators/ShapeIdComparator';
import { ShapeNameComparator } from './comparators/ShapeNameComparator';
import { ShapeByFirstPointXComparator } from './comparators/ShapeByFirstPointXComparator';

/**
 * Demonstration of Repository Pattern with Specification and Observer patterns
 * 
 * This example shows:
 * 1. Repository pattern for CRUD operations
 * 2. Specification pattern for searching
 * 3. Comparator pattern for sorting
 * 4. Observer pattern with Warehouse (Singleton)
 * 5. Automatic calculation updates when shapes change
 */

console.log('=== Shape Repository Demo ===\n');

// Create repository and warehouse
const repository = new ShapeRepository();
const warehouse = Warehouse.getInstance();

console.log('1. Adding shapes to repository:');
// Add some shapes
const sphere1 = new MutableSphere('s1', 'SmallSphere', new Point(1, 2, 3), 5);
const sphere2 = new MutableSphere('s2', 'LargeSphere', new Point(-5, -5, -5), 10);
const sphere3 = new MutableSphere('s3', 'MediumSphere', new Point(0, 0, 0), 7);

const triangle1 = new MutableTriangle(
  't1',
  'RightTriangle',
  new Point(0, 0, 0),
  new Point(3, 0, 0),
  new Point(0, 4, 0)
);

const triangle2 = new MutableTriangle(
  't2',
  'EquilateralTriangle',
  new Point(1, 1, 1),
  new Point(2, 1, 1),
  new Point(1.5, 1.866, 1)
);

repository.add(sphere1);
repository.add(sphere2);
repository.add(sphere3);
repository.add(triangle1);
repository.add(triangle2);

console.log(`✓ Added ${repository.size()} shapes to repository\n`);

// Demonstrate Warehouse integration
console.log('2. Warehouse stores characteristics automatically:');
const sphere1Chars = warehouse.getCharacteristics('s1');
console.log(`   SmallSphere - Area: ${sphere1Chars?.area?.toFixed(2)}, Volume: ${sphere1Chars?.volume?.toFixed(2)}`);

const triangle1Chars = warehouse.getCharacteristics('t1');
console.log(`   RightTriangle - Area: ${triangle1Chars?.area?.toFixed(2)}, Perimeter: ${triangle1Chars?.perimeter?.toFixed(2)}\n`);

// Demonstrate Observer pattern
console.log('3. Observer pattern - updating shape triggers recalculation:');
console.log(`   Before: SmallSphere radius = 5, volume = ${sphere1Chars?.volume?.toFixed(2)}`);
sphere1.setRadius(10);
const updatedChars = warehouse.getCharacteristics('s1');
console.log(`   After: SmallSphere radius = 10, volume = ${updatedChars?.volume?.toFixed(2)}\n`);

// Demonstrate Specification pattern
console.log('4. Specification pattern - searching shapes:');

// Find by ID
const byIdSpec = new ShapeByIdSpecification('s2');
const foundById = repository.findBySpecification(byIdSpec);
console.log(`   ✓ Find by ID 's2': ${foundById[0]?.getName()}`);

// Find by name
const byNameSpec = new ShapeByNameSpecification('RightTriangle');
const foundByName = repository.findBySpecification(byNameSpec);
console.log(`   ✓ Find by name 'RightTriangle': ${foundByName[0]?.getId()}`);

// Find shapes in first quadrant (all coordinates >= 0)
const firstQuadrantSpec = new ShapeInFirstQuadrantSpecification();
const inFirstQuadrant = repository.findBySpecification(firstQuadrantSpec);
console.log(`   ✓ Shapes in first quadrant: ${inFirstQuadrant.map(s => s.getName()).join(', ')}`);

// Find shapes by distance from origin
const distanceSpec = new ShapeByDistanceRangeSpecification(0, 5);
const nearOrigin = repository.findBySpecification(distanceSpec);
console.log(`   ✓ Shapes near origin (distance 0-5): ${nearOrigin.map(s => s.getName()).join(', ')}`);

// Find shapes by area range
const areaSpec = new ShapeByAreaRangeSpecification(0, 100);
const smallAreaShapes = repository.findBySpecification(areaSpec);
console.log(`   ✓ Shapes with small area (0-100): ${smallAreaShapes.map(s => s.getName()).join(', ')}`);

// Find shapes by volume range
const volumeSpec = new ShapeByVolumeRangeSpecification(1000, 5000);
const mediumVolumeShapes = repository.findBySpecification(volumeSpec);
console.log(`   ✓ Shapes with medium volume (1000-5000): ${mediumVolumeShapes.map(s => s.getName()).join(', ')}`);

// Combine specifications
const combinedSpec = new ShapeByIdSpecification('s1').or(new ShapeByIdSpecification('t1'));
const combined = repository.findBySpecification(combinedSpec);
console.log(`   ✓ Combined (s1 OR t1): ${combined.map(s => s.getName()).join(', ')}\n`);

// Demonstrate Comparator pattern
console.log('5. Comparator pattern - sorting shapes:');

// Sort by ID
const sortedById = repository.sort(ShapeIdComparator.compare);
console.log(`   ✓ Sort by ID: ${sortedById.map(s => s.getId()).join(', ')}`);

// Sort by name
const sortedByName = repository.sort(ShapeNameComparator.compare);
console.log(`   ✓ Sort by name: ${sortedByName.map(s => s.getName()).join(', ')}`);

// Sort by X coordinate
const sortedByX = repository.sort(ShapeByFirstPointXComparator.compare);
console.log(`   ✓ Sort by X coord: ${sortedByX.map(s => s.getName()).join(', ')}\n`);

// Demonstrate CRUD operations
console.log('6. Repository CRUD operations:');
console.log(`   Initial size: ${repository.size()}`);

// Remove a shape
repository.remove('s2');
console.log(`   After removing 's2': ${repository.size()}`);

// Verify warehouse also cleaned up
const removedChars = warehouse.getCharacteristics('s2');
console.log(`   ✓ Warehouse cleaned up: ${removedChars === undefined ? 'Yes' : 'No'}\n`);

console.log('=== Demo Complete ===');
