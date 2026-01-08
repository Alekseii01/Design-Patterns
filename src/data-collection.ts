import { DataRecord, Visitable, DataVisitor } from './types';
export class DataCollection implements Visitable {
  private records: DataRecord[] = [];
  private metadata: Record<string, any> = {};
  constructor(records: DataRecord[] = [], metadata: Record<string, any> = {}) {
    this.records = [...records];
    this.metadata = { ...metadata };
  }
  addRecord(record: DataRecord): void {
    this.records.push(record);
  }
  addRecords(records: DataRecord[]): void {
    this.records.push(...records);
  }
  getRecords(): DataRecord[] {
    return [...this.records];
  }
  getRecord(id: string): DataRecord | undefined {
    return this.records.find(record => record.id === id);
  }
  filterRecords(predicate: (record: DataRecord) => boolean): DataRecord[] {
    return this.records.filter(predicate);
  }
  getCount(): number {
    return this.records.length;
  }
  clear(): void {
    this.records = [];
  }
  getMetadata(): Record<string, any> {
    return { ...this.metadata };
  }
  setMetadata(key: string, value: any): void {
    this.metadata[key] = value;
  }
  accept(visitor: DataVisitor): any {
    this.records.forEach(record => visitor.visitRecord(record));
    return visitor.visitCollection(this.records);
  }
  clone(): DataCollection {
    return new DataCollection(this.records, this.metadata);
  }
  sortByTimestamp(ascending: boolean = true): void {
    this.records.sort((a, b) => {
      const diff = a.timestamp.getTime() - b.timestamp.getTime();
      return ascending ? diff : -diff;
    });
  }
}