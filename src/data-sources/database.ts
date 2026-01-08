export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}
export interface DatabaseRow {
  record_id: string;
  created_at: string;
  measurement: number;
  extra_data: string;
}
export class DatabaseClient {
  private config: DatabaseConfig;
  private connected: boolean = false;
  constructor(config: DatabaseConfig) {
    this.config = config;
  }
  async connect(): Promise<void> {
    console.log(`Connecting to database at ${this.config.host}:${this.config.port}...`);
    await new Promise(resolve => setTimeout(resolve, 100));
    this.connected = true;
    console.log('Database connected');
  }
  async disconnect(): Promise<void> {
    console.log('Disconnecting from database...');
    this.connected = false;
  }
  async query(sql: string): Promise<DatabaseRow[]> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    console.log(`Executing query: ${sql}`);
    return [
      {
        record_id: 'db_001',
        created_at: '2025-01-08T10:00:00Z',
        measurement: 42.5,
        extra_data: '{"source": "sensor_1"}'
      },
      {
        record_id: 'db_002',
        created_at: '2025-01-08T11:00:00Z',
        measurement: 38.2,
        extra_data: '{"source": "sensor_2"}'
      }
    ];
  }
  isConnected(): boolean {
    return this.connected;
  }
}