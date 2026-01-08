import { 
  StatisticsVisitor, 
  FilterVisitor, 
  GroupingVisitor 
} from '../src/visitors/data-visitors';
import { 
  ExportVisitor, 
  ValidationVisitor 
} from '../src/visitors/export-validation-visitors';
import { DataRecord } from '../src/types';
describe('Data Visitors', () => {
  let testRecords: DataRecord[];
  beforeEach(() => {
    testRecords = [
      {
        id: 'record-1',
        timestamp: new Date('2025-01-01T10:00:00Z'),
        value: 25.5,
        metadata: { source: 'database', type: 'temperature' }
      },
      {
        id: 'record-2',
        timestamp: new Date('2025-01-01T11:00:00Z'),
        value: 30.2,
        metadata: { source: 'api', type: 'temperature' }
      },
      {
        id: 'record-3',
        timestamp: new Date('2025-01-01T12:00:00Z'),
        value: 28.8,
        metadata: { source: 'file', type: 'humidity' }
      },
      {
        id: 'record-4',
        timestamp: new Date('2025-01-01T13:00:00Z'),
        value: 15.1,
        metadata: { source: 'database', type: 'temperature' }
      }
    ];
  });
  describe('StatisticsVisitor', () => {
    test('should calculate correct statistics', () => {
      const visitor = new StatisticsVisitor();
      testRecords.forEach(record => visitor.visitRecord(record));
      const result = visitor.visitCollection(testRecords);
      expect(result.count).toBe(4);
      expect(result.sum).toBeCloseTo(99.6, 1);
      expect(result.mean).toBeCloseTo(24.9, 1);
      expect(result.min).toBe(15.1);
      expect(result.max).toBe(30.2);
      expect(result.range).toBeCloseTo(15.1, 1);
      expect(result.median).toBeCloseTo(27.15, 2);
    });
    test('should handle empty dataset', () => {
      const visitor = new StatisticsVisitor();
      const result = visitor.visitCollection([]);
      expect(result.error).toBe('No data to process');
    });
  });
  describe('FilterVisitor', () => {
    test('should filter by value range', () => {
      const visitor = new FilterVisitor({
        minValue: 20,
        maxValue: 30
      });
      testRecords.forEach(record => visitor.visitRecord(record));
      const result = visitor.visitCollection(testRecords);
      expect(result.originalCount).toBe(4);
      expect(result.filteredCount).toBe(2);
      expect(result.filteredRecords).toHaveLength(2);
    });
    test('should filter by source', () => {
      const visitor = new FilterVisitor({
        sources: ['database', 'api']
      });
      testRecords.forEach(record => visitor.visitRecord(record));
      const result = visitor.visitCollection(testRecords);
      expect(result.filteredCount).toBe(3);
      expect(result.filteredRecords.every((r: any) => 
        r.metadata.source === 'database' || r.metadata.source === 'api'
      )).toBe(true);
    });
    test('should filter by custom function', () => {
      const visitor = new FilterVisitor({
        customFilter: (record) => record.metadata.type === 'temperature'
      });
      testRecords.forEach(record => visitor.visitRecord(record));
      const result = visitor.visitCollection(testRecords);
      expect(result.filteredCount).toBe(3);
      expect(result.filteredRecords.every((r: any) => 
        r.metadata.type === 'temperature'
      )).toBe(true);
    });
  });
  describe('GroupingVisitor', () => {
    test('should group by source', () => {
      const visitor = new GroupingVisitor(GroupingVisitor.groupBySource());
      testRecords.forEach(record => visitor.visitRecord(record));
      const result = visitor.visitCollection(testRecords);
      expect(result.totalGroups).toBe(3);
      expect(result.groups.database.count).toBe(2);
      expect(result.groups.api.count).toBe(1);
      expect(result.groups.file.count).toBe(1);
    });
    test('should group by day', () => {
      const visitor = new GroupingVisitor(GroupingVisitor.groupByDay());
      testRecords.forEach(record => visitor.visitRecord(record));
      const result = visitor.visitCollection(testRecords);
      expect(result.totalGroups).toBe(1);
      expect(result.groups['2025-01-01'].count).toBe(4);
    });
    test('should group by value range', () => {
      const visitor = new GroupingVisitor(GroupingVisitor.groupByValueRange(10));
      testRecords.forEach(record => visitor.visitRecord(record));
      const result = visitor.visitCollection(testRecords);
      expect(result.totalGroups).toBe(3);
      expect(result.groups['10-20']).toBeDefined();
      expect(result.groups['20-30']).toBeDefined();
      expect(result.groups['30-40']).toBeDefined();
    });
  });
  describe('ExportVisitor', () => {
    test('should export to JSON format', () => {
      const visitor = new ExportVisitor('json', { indentation: 2 });
      const result = visitor.visitCollection(testRecords.slice(0, 2));
      expect(result.format).toBe('json');
      expect(result.recordCount).toBe(2);
      expect(result.exportedData).toContain('exportInfo');
      expect(result.exportedData).toContain('data');
      expect(() => JSON.parse(result.exportedData)).not.toThrow();
    });
    test('should export to CSV format', () => {
      const visitor = new ExportVisitor('csv', { separator: ',' });
      const result = visitor.visitCollection(testRecords.slice(0, 2));
      expect(result.format).toBe('csv');
      expect(result.recordCount).toBe(2);
      expect(result.exportedData).toContain('id,timestamp,value,metadata');
      expect(result.exportedData.split('\n')).toHaveLength(3); 
    });
    test('should export to XML format', () => {
      const visitor = new ExportVisitor('xml', { indentation: 2 });
      const result = visitor.visitCollection(testRecords.slice(0, 1));
      expect(result.format).toBe('xml');
      expect(result.recordCount).toBe(1);
      expect(result.exportedData).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result.exportedData).toContain('<dataExport>');
      expect(result.exportedData).toContain('</dataExport>');
    });
  });
  describe('ValidationVisitor', () => {
    test('should validate value range', () => {
      const visitor = new ValidationVisitor({
        valueRange: { min: 20, max: 35 }
      });
      testRecords.forEach(record => visitor.visitRecord(record));
      const result = visitor.visitCollection(testRecords);
      expect(result.totalRecords).toBe(4);
      expect(result.validRecords).toBe(3);
      expect(result.invalidRecords).toBe(1);
      expect(result.validationRate).toBeCloseTo(0.75, 2);
    });
    test('should validate with custom validators', () => {
      const visitor = new ValidationVisitor({
        customValidators: [
          {
            name: 'ID Length',
            validator: (record) => record.id.length >= 8,
            message: 'ID must be at least 8 characters'
          }
        ]
      });
      testRecords.forEach(record => visitor.visitRecord(record));
      const result = visitor.visitCollection(testRecords);
      expect(result.totalRecords).toBe(4);
      expect(result.validRecords).toBe(4);
      expect(result.invalidRecords).toBe(0);
    });
    test('should validate timestamp range', () => {
      const visitor = new ValidationVisitor({
        timestampRange: {
          start: new Date('2025-01-01T09:00:00Z'),
          end: new Date('2025-01-01T11:30:00Z')
        }
      });
      testRecords.forEach(record => visitor.visitRecord(record));
      const result = visitor.visitCollection(testRecords);
      expect(result.validRecords).toBe(2); 
      expect(result.invalidRecords).toBe(2);
    });
  });
});