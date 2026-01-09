import { DataRecord, DataVisitor, ProcessingResult } from '../types';
export abstract class BaseDataVisitor implements DataVisitor {
  protected result: ProcessingResult;
  constructor() {
    this.result = {
      type: this.constructor.name,
      result: null,
      timestamp: new Date()
    };
  }
  abstract visitRecord(record: DataRecord): void;
  abstract visitCollection(records: DataRecord[]): any;
  getResult(): ProcessingResult {
    return { ...this.result };
  }
}
export class StatisticsVisitor extends BaseDataVisitor {
  private sum: number = 0;
  private count: number = 0;
  private min: number = Infinity;
  private max: number = -Infinity;
  visitRecord(record: DataRecord): void {
    const value = record.value;
    this.sum += value;
    this.count++;
    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);
  }
  visitCollection(_records: DataRecord[]): any {
    if (this.count === 0) {
      this.result.result = { error: 'No data to process' };
      return this.result.result;
    }
    this.result.result = {
      count: this.count,
      sum: this.sum,
      mean: this.sum / this.count,
      min: this.min,
      max: this.max,
      range: this.max - this.min
    };
    return this.result.result;
  }
}
export class FilterVisitor extends BaseDataVisitor {
  private filteredRecords: DataRecord[] = [];
  private filterCriteria: {
    minValue?: number;
    maxValue?: number;
  };
  constructor(criteria: FilterVisitor['filterCriteria'] = {}) {
    super();
    this.filterCriteria = criteria;
  }
  visitRecord(record: DataRecord): void {
    let shouldInclude = true;
    if (this.filterCriteria.minValue !== undefined && record.value < this.filterCriteria.minValue) {
      shouldInclude = false;
    }
    if (this.filterCriteria.maxValue !== undefined && record.value > this.filterCriteria.maxValue) {
      shouldInclude = false;
    }
    if (shouldInclude) {
      this.filteredRecords.push(record);
    }
  }
  visitCollection(records: DataRecord[]): any {
    this.result.result = {
      originalCount: records.length,
      filteredCount: this.filteredRecords.length,
      filteredRecords: [...this.filteredRecords]
    };
    return this.result.result;
  }
}