import { DataSource, DataRecord } from '../types';
import { DatabaseClient, DatabaseConfig } from '../data-sources/database';
export class DatabaseAdapter implements DataSource {
  private client: DatabaseClient;
  constructor(config: DatabaseConfig) {
    this.client = new DatabaseClient(config);
  }
  async connect(): Promise<void> {
    await this.client.connect();
  }
  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }
  async fetchData(): Promise<DataRecord[]> {
    const rows = await this.client.query('SELECT * FROM measurements ORDER BY created_at DESC LIMIT 100');
    return rows.map(row => ({
      id: row.record_id,
      timestamp: new Date(row.created_at),
      value: row.measurement,
      metadata: {
        source: 'database',
        extra: JSON.parse(row.extra_data)
      }
    }));
  }
  isConnected(): boolean {
    return this.client.isConnected();
  }
}