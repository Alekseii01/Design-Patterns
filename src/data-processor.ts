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
    console.log(`Data source '${name}' registered successfully`);
  }
  unregisterDataSource(name: string): boolean {
    if (this.dataSources.has(name)) {
      this.dataSources.delete(name);
      console.log(`Data source '${name}' unregistered successfully`);
      return true;
    }
    console.log(`Data source '${name}' not found`);
    return false;
  }
  getDataSources(): string[] {
    return Array.from(this.dataSources.keys());
  }
  async connectToSource(sourceName: string): Promise<void> {
    const source = this.dataSources.get(sourceName);
    if (!source) {
      throw new Error(`Data source '${sourceName}' not found`);
    }
    await source.connect();
    console.log(`Connected to data source '${sourceName}'`);
  }
  async connectToAllSources(): Promise<void> {
    const connectionPromises = Array.from(this.dataSources.entries()).map(
      async ([name, source]) => {
        try {
          await source.connect();
          console.log(`Connected to '${name}'`);
        } catch (error) {
          console.error(`Failed to connect to '${name}':`, error);
          throw error;
        }
      }
    );
    await Promise.all(connectionPromises);
    console.log('All data sources connected successfully');
  }
  async disconnectFromSource(sourceName: string): Promise<void> {
    const source = this.dataSources.get(sourceName);
    if (!source) {
      throw new Error(`Data source '${sourceName}' not found`);
    }
    await source.disconnect();
    console.log(`Disconnected from data source '${sourceName}'`);
  }
  async disconnectFromAllSources(): Promise<void> {
    const disconnectionPromises = Array.from(this.dataSources.entries()).map(
      async ([name, source]) => {
        try {
          if (source.isConnected()) {
            await source.disconnect();
            console.log(`Disconnected from '${name}'`);
          }
        } catch (error) {
          console.error(`Failed to disconnect from '${name}':`, error);
        }
      }
    );
    await Promise.allSettled(disconnectionPromises);
    console.log('Disconnected from all data sources');
  }
  async loadDataFromSource(sourceName: string): Promise<DataRecord[]> {
    const source = this.dataSources.get(sourceName);
    if (!source) {
      throw new Error(`Data source '${sourceName}' not found`);
    }
    if (!source.isConnected()) {
      throw new Error(`Data source '${sourceName}' is not connected`);
    }
    const records = await source.fetchData();
    this.dataCollection.addRecords(records);
    this.dataCollection.setMetadata(`lastLoadFrom_${sourceName}`, new Date());
    console.log(`Loaded ${records.length} records from '${sourceName}'`);
    return records;
  }
  async loadDataFromAllSources(): Promise<DataRecord[]> {
    const allRecords: DataRecord[] = [];
    for (const [name, source] of this.dataSources) {
      try {
        if (source.isConnected()) {
          const records = await this.loadDataFromSource(name);
          allRecords.push(...records);
        } else {
          console.warn(`Skipping '${name}': not connected`);
        }
      } catch (error) {
        console.error(`Failed to load data from '${name}':`, error);
      }
    }
    this.dataCollection.setMetadata('lastFullLoad', new Date());
    console.log(`Total loaded: ${allRecords.length} records from all sources`);
    return allRecords;
  }
  processData(visitor: DataVisitor): ProcessingResult {
    console.log(`Processing data with ${visitor.constructor.name}...`);
    const startTime = Date.now();
    const result = this.dataCollection.accept(visitor);
    const endTime = Date.now();
    const processingResult: ProcessingResult = {
      type: visitor.constructor.name,
      result: result,
      timestamp: new Date()
    };
    this.dataCollection.setMetadata('lastProcessing', {
      visitor: visitor.constructor.name,
      duration: endTime - startTime,
      timestamp: new Date()
    });
    console.log(`Processing completed in ${endTime - startTime}ms`);
    return processingResult;
  }
  processDataWithMultipleVisitors(visitors: DataVisitor[]): ProcessingResult[] {
    console.log(`Processing data with ${visitors.length} visitors...`);
    const results: ProcessingResult[] = [];
    for (const visitor of visitors) {
      const result = this.processData(visitor);
      results.push(result);
    }
    return results;
  }
  getDataCollection(): DataCollection {
    return this.dataCollection.clone();
  }
  clearData(): void {
    this.dataCollection.clear();
    console.log('All data cleared');
  }
  getSystemInfo(): any {
    const connectedSources = Array.from(this.dataSources.entries())
      .filter(([_, source]) => source.isConnected())
      .map(([name]) => name);
    return {
      registeredSources: this.getDataSources(),
      connectedSources: connectedSources,
      totalRecords: this.dataCollection.getCount(),
      metadata: this.dataCollection.getMetadata(),
      systemStatus: {
        allSourcesConnected: connectedSources.length === this.dataSources.size,
        hasData: this.dataCollection.getCount() > 0
      }
    };
  }
  getSourceStatus(sourceName: string): any {
    const source = this.dataSources.get(sourceName);
    if (!source) {
      return { exists: false };
    }
    return {
      exists: true,
      connected: source.isConnected(),
      type: source.constructor.name
    };
  }
}