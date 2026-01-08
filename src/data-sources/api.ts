export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}
export interface ApiResponse {
  success: boolean;
  data: ApiDataPoint[];
  pagination?: {
    page: number;
    totalPages: number;
  };
}
export interface ApiDataPoint {
  uuid: string;
  timestamp: number;
  value: number;
  tags: string[];
  properties: Record<string, any>;
}
export class ApiClient {
  private config: ApiConfig;
  private connected: boolean = false;
  constructor(config: ApiConfig) {
    this.config = config;
  }
  async connect(): Promise<void> {
    console.log(`Connecting to API at ${this.config.baseUrl}...`);
    await new Promise(resolve => setTimeout(resolve, 150));
    this.connected = true;
    console.log('API connected');
  }
  async disconnect(): Promise<void> {
    console.log('Disconnecting from API...');
    this.connected = false;
  }
  async getData(endpoint: string): Promise<ApiResponse> {
    if (!this.connected) {
      throw new Error('API not connected');
    }
    console.log(`Fetching data from endpoint: ${endpoint}`);
    return {
      success: true,
      data: [
        {
          uuid: 'api-001',
          timestamp: Date.now() - 3600000,
          value: 25.7,
          tags: ['temperature', 'outdoor'],
          properties: { location: 'garden' }
        },
        {
          uuid: 'api-002',
          timestamp: Date.now() - 1800000,
          value: 67.3,
          tags: ['humidity', 'outdoor'],
          properties: { location: 'garden' }
        }
      ]
    };
  }
  isConnected(): boolean {
    return this.connected;
  }
}