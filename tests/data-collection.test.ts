import { DataCollection } from '../src/data-collection';
import { StatisticsVisitor } from '../src/visitors/data-visitors';
import { DataRecord } from '../src/types';
describe('DataCollection', () => {
  let dataCollection: DataCollection;
  let testRecords: DataRecord[];
  beforeEach(() => {
    testRecords = [
      {
        id: 'test-1',
        timestamp: new Date('2025-01-01T10:00:00Z'),
        value: 25.5,
        metadata: { source: 'test', type: 'temperature' }
      },
      {
        id: 'test-2',
        timestamp: new Date('2025-01-01T11:00:00Z'),
        value: 30.2,
        metadata: { source: 'test', type: 'temperature' }
      },
      {
        id: 'test-3',
        timestamp: new Date('2025-01-01T12:00:00Z'),
        value: 28.8,
        metadata: { source: 'test', type: 'temperature' }
      }
    ];
    dataCollection = new DataCollection(testRecords);
  });
  test('should create collection with initial records', () => {
    expect(dataCollection.getCount()).toBe(3);
    expect(dataCollection.getRecords()).toHaveLength(3);
  });
  test('should add single record', () => {
    const newRecord: DataRecord = {
      id: 'test-4',
      timestamp: new Date('2025-01-01T13:00:00Z'),
      value: 32.1,
      metadata: { source: 'test', type: 'temperature' }
    };
    dataCollection.addRecord(newRecord);
    expect(dataCollection.getCount()).toBe(4);
    expect(dataCollection.getRecord('test-4')).toEqual(newRecord);
  });
  test('should add multiple records', () => {
    const newRecords: DataRecord[] = [
      {
        id: 'test-4',
        timestamp: new Date('2025-01-01T13:00:00Z'),
        value: 32.1,
        metadata: { source: 'test', type: 'temperature' }
      },
      {
        id: 'test-5',
        timestamp: new Date('2025-01-01T14:00:00Z'),
        value: 29.7,
        metadata: { source: 'test', type: 'temperature' }
      }
    ];
    dataCollection.addRecords(newRecords);
    expect(dataCollection.getCount()).toBe(5);
  });
  test('should filter records correctly', () => {
    const filtered = dataCollection.filterRecords(record => record.value > 28);
    expect(filtered).toHaveLength(2);
    expect(filtered.every(record => record.value > 28)).toBe(true);
  });
  test('should sort by timestamp', () => {
    const unsortedCollection = new DataCollection();
    unsortedCollection.addRecord(testRecords[2]); 
    unsortedCollection.addRecord(testRecords[0]); 
    unsortedCollection.addRecord(testRecords[1]); 
    unsortedCollection.sortByTimestamp(true);
    const sorted = unsortedCollection.getRecords();
    expect(sorted[0].id).toBe('test-1'); 
    expect(sorted[1].id).toBe('test-2'); 
    expect(sorted[2].id).toBe('test-3'); 
  });
  test('should accept visitor and return result', () => {
    const statisticsVisitor = new StatisticsVisitor();
    const result = dataCollection.accept(statisticsVisitor);
    expect(result).toBeDefined();
    expect(result.count).toBe(3);
    expect(result.mean).toBeCloseTo(28.17, 2);
    expect(result.min).toBe(25.5);
    expect(result.max).toBe(30.2);
  });
  test('should manage metadata', () => {
    dataCollection.setMetadata('lastUpdate', new Date());
    dataCollection.setMetadata('source', 'unit-test');
    const metadata = dataCollection.getMetadata();
    expect(metadata.source).toBe('unit-test');
    expect(metadata.lastUpdate).toBeInstanceOf(Date);
  });
  test('should clear all records', () => {
    expect(dataCollection.getCount()).toBe(3);
    dataCollection.clear();
    expect(dataCollection.getCount()).toBe(0);
    expect(dataCollection.getRecords()).toHaveLength(0);
  });
  test('should clone collection', () => {
    const cloned = dataCollection.clone();
    expect(cloned.getCount()).toBe(dataCollection.getCount());
    expect(cloned.getRecords()).toEqual(dataCollection.getRecords());
    cloned.addRecord({
      id: 'clone-test',
      timestamp: new Date(),
      value: 100,
      metadata: {}
    });
    expect(cloned.getCount()).toBe(4);
    expect(dataCollection.getCount()).toBe(3);
  });
});