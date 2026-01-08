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
  private values: number[] = [];
  visitRecord(record: DataRecord): void {
    const value = record.value;
    this.sum += value;
    this.count++;
    this.min = Math.min(this.min, value);
    this.max = Math.max(this.max, value);
    this.values.push(value);
  }
  visitCollection(records: DataRecord[]): any {
    if (this.count === 0) {
      this.result.result = {
        error: 'No data to process'
      };
      return this.result.result;
    }
    const mean = this.sum / this.count;
    const variance = this.values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / this.count;
    const standardDeviation = Math.sqrt(variance);
    const sortedValues = [...this.values].sort((a, b) => a - b);
    const median = this.count % 2 === 0
      ? (sortedValues[this.count / 2 - 1] + sortedValues[this.count / 2]) / 2
      : sortedValues[Math.floor(this.count / 2)];
    this.result.result = {
      count: this.count,
      sum: this.sum,
      mean: mean,
      median: median,
      min: this.min,
      max: this.max,
      range: this.max - this.min,
      variance: variance,
      standardDeviation: standardDeviation,
      dataRange: {
        earliest: records.reduce((min, rec) => rec.timestamp < min ? rec.timestamp : min, records[0]?.timestamp),
        latest: records.reduce((max, rec) => rec.timestamp > max ? rec.timestamp : max, records[0]?.timestamp)
      }
    };
    return this.result.result;
  }
}
export class FilterVisitor extends BaseDataVisitor {
  private filteredRecords: DataRecord[] = [];
  private filterCriteria: {
    minValue?: number;
    maxValue?: number;
    dateRange?: { start: Date; end: Date };
    sources?: string[];
    customFilter?: (record: DataRecord) => boolean;
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
    if (this.filterCriteria.dateRange) {
      const { start, end } = this.filterCriteria.dateRange;
      if (record.timestamp < start || record.timestamp > end) {
        shouldInclude = false;
      }
    }
    if (this.filterCriteria.sources && this.filterCriteria.sources.length > 0) {
      const recordSource = record.metadata.source;
      if (!this.filterCriteria.sources.includes(recordSource)) {
        shouldInclude = false;
      }
    }
    if (this.filterCriteria.customFilter && !this.filterCriteria.customFilter(record)) {
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
      filteredRecords: [...this.filteredRecords],
      criteria: this.filterCriteria
    };
    return this.result.result;
  }
}
export class GroupingVisitor extends BaseDataVisitor {
  private groups: Map<string, DataRecord[]> = new Map();
  private groupBy: (record: DataRecord) => string;
  constructor(groupByFunction: (record: DataRecord) => string) {
    super();
    this.groupBy = groupByFunction;
  }
  visitRecord(record: DataRecord): void {
    const groupKey = this.groupBy(record);
    if (!this.groups.has(groupKey)) {
      this.groups.set(groupKey, []);
    }
    this.groups.get(groupKey)!.push(record);
  }
  visitCollection(_records: DataRecord[]): any {
    const groupResults: Record<string, any> = {};
    for (const [groupKey, groupRecords] of this.groups) {
      const stats = new StatisticsVisitor();
      stats.visitCollection(groupRecords);
      groupResults[groupKey] = {
        count: groupRecords.length,
        records: groupRecords,
        statistics: stats.getResult().result
      };
    }
    this.result.result = {
      totalGroups: this.groups.size,
      groups: groupResults
    };
    return this.result.result;
  }
  static groupBySource(): (record: DataRecord) => string {
    return (record) => record.metadata.source || 'unknown';
  }
  static groupByHour(): (record: DataRecord) => string {
    return (record) => record.timestamp.toISOString().slice(0, 13) + ':00:00.000Z';
  }
  static groupByDay(): (record: DataRecord) => string {
    return (record) => record.timestamp.toISOString().slice(0, 10);
  }
  static groupByValueRange(rangeSize: number = 10): (record: DataRecord) => string {
    return (record) => {
      const rangeStart = Math.floor(record.value / rangeSize) * rangeSize;
      return `${rangeStart}-${rangeStart + rangeSize}`;
    };
  }
}