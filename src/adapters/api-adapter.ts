import { DataSource, DataRecord } from '../types';
import { ApiClient, ApiConfig } from '../data-sources/api';
export class ApiAdapter implements DataSource {
  private client: ApiClient;
  private endpoint: string;
  constructor(config: ApiConfig, endpoint: string = '/data') {
    this.client = new ApiClient(config);
    this.endpoint = endpoint;
  }
  async connect(): Promise<void> {
    await this.client.connect();
  }
  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }
  async fetchData(): Promise<DataRecord[]> {
    const response = await this.client.getData(this.endpoint);
    if (!response.success) {
      throw new Error('Failed to fetch data from API');
    }
    return response.data.map(point => ({
      id: point.uuid,
      timestamp: new Date(point.timestamp),
      value: point.value,
      metadata: {
        source: 'api',
        tags: point.tags,
        properties: point.properties
      }
    }));
  }
  isConnected(): boolean {
    return this.client.isConnected();
  }
}