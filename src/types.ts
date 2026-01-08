export interface DataRecord {
  id: string;
  timestamp: Date;
  value: number;
  metadata: Record<string, any>;
}
export interface DataSource {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  fetchData(): Promise<DataRecord[]>;
  isConnected(): boolean;
}
export interface DataVisitor {
  visitRecord(record: DataRecord): void;
  visitCollection(records: DataRecord[]): any;
}
export interface Visitable {
  accept(visitor: DataVisitor): any;
}
export interface ProcessingResult {
  type: string;
  result: any;
  timestamp: Date;
}