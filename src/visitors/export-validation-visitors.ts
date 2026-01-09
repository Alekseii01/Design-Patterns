import { DataRecord } from '../types';
import { BaseDataVisitor } from './data-visitors';
export class ExportVisitor extends BaseDataVisitor {
  private format: 'json' | 'csv';
  constructor(format: 'json' | 'csv' = 'json') {
    super();
    this.format = format;
  }
  visitRecord(_record: DataRecord): void {
  }
  visitCollection(records: DataRecord[]): any {
    let exportedData: string;
    if (this.format === 'json') {
      exportedData = JSON.stringify(records, null, 2);
    } else {
      const headers = ['id', 'timestamp', 'value'];
      const csvRows = [headers.join(',')];
      for (const record of records) {
        const row = [record.id, record.timestamp.toISOString(), record.value.toString()];
        csvRows.push(row.join(','));
      }
      exportedData = csvRows.join('\n');
    }
    this.result.result = {
      format: this.format,
      recordCount: records.length,
      exportedData: exportedData
    };
    return this.result.result;
  }
}
export class ValidationVisitor extends BaseDataVisitor {
  private validRecords: DataRecord[] = [];
  private invalidRecords: DataRecord[] = [];
  private minValue: number;
  private maxValue: number;
  constructor(minValue: number = -Infinity, maxValue: number = Infinity) {
    super();
    this.minValue = minValue;
    this.maxValue = maxValue;
  }
  visitRecord(record: DataRecord): void {
    if (record.value >= this.minValue && record.value <= this.maxValue) {
      this.validRecords.push(record);
    } else {
      this.invalidRecords.push(record);
    }
  }
  visitCollection(records: DataRecord[]): any {
    this.result.result = {
      totalRecords: records.length,
      validRecords: this.validRecords.length,
      invalidRecords: this.invalidRecords.length,
      validRecordsList: this.validRecords
    };
    return this.result.result;
  }
}