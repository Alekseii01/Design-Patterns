import { DataSource, DataRecord, DataVisitor, ProcessingResult } from './types';
import { DataCollection } from './data-collection';
export class DataProcessor {
  private dataSources: Map<string, DataSource> = new Map();
  private dataCollection: DataCollection;
  constructor() {
    this.dataCollection = new DataCollection();
  }
  registerDataSource(name: string, dataSource: DataSource): void {
    this.dataSources.set(name, dataSource);
  }
  getDataSources(): string[] {
    return Array.from(this.dataSources.keys());
  }
  async connectToAllSources(): Promise<void> {
    for (const source of this.dataSources.values()) {
      await source.connect();
    }
  }
  async disconnectFromAllSources(): Promise<void> {
    for (const source of this.dataSources.values()) {
      if (source.isConnected()) {
        await source.disconnect();
      }
    }
  }
  async loadDataFromAllSources(): Promise<DataRecord[]> {
    const allRecords: DataRecord[] = [];
    for (const source of this.dataSources.values()) {
      if (source.isConnected()) {
        const records = await source.fetchData();
        this.dataCollection.addRecords(records);
        allRecords.push(...records);
      }
    }
    return allRecords;
  }
  processData(visitor: DataVisitor): ProcessingResult {
    const result = this.dataCollection.accept(visitor);
    return {
      type: visitor.constructor.name,
      result: result,
      timestamp: new Date()
    };
  }
  getDataCollection(): DataCollection {
    return this.dataCollection;
  }
}