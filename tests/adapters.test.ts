import { DatabaseAdapter } from '../src/adapters/database-adapter';
import { ApiAdapter } from '../src/adapters/api-adapter';
import { FileAdapter } from '../src/adapters/file-adapter';
describe('Data Adapters', () => {
  describe('DatabaseAdapter', () => {
    let adapter: DatabaseAdapter;
    beforeEach(() => {
      adapter = new DatabaseAdapter({
        host: 'localhost',
        port: 5432,
        database: 'testdb',
        username: 'testuser',
        password: 'testpass'
      });
    });
    test('should connect successfully', async () => {
      await adapter.connect();
      expect(adapter.isConnected()).toBe(true);
    });
    test('should disconnect successfully', async () => {
      await adapter.connect();
      await adapter.disconnect();
      expect(adapter.isConnected()).toBe(false);
    });
    test('should fetch and adapt data correctly', async () => {
      await adapter.connect();
      const data = await adapter.fetchData();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      const record = data[0];
      expect(record).toHaveProperty('id');
      expect(record).toHaveProperty('timestamp');
      expect(record).toHaveProperty('value');
      expect(record).toHaveProperty('metadata');
      expect(record.metadata.source).toBe('database');
    });
    test('should throw error when fetching data without connection', async () => {
      await expect(adapter.fetchData()).rejects.toThrow('Database not connected');
    });
  });
  describe('ApiAdapter', () => {
    let adapter: ApiAdapter;
    beforeEach(() => {
      adapter = new ApiAdapter({
        baseUrl: 'https://api.test.com',
        apiKey: 'test-key',
        timeout: 5000
      }, '/test-endpoint');
    });
    test('should connect successfully', async () => {
      await adapter.connect();
      expect(adapter.isConnected()).toBe(true);
    });
    test('should disconnect successfully', async () => {
      await adapter.connect();
      await adapter.disconnect();
      expect(adapter.isConnected()).toBe(false);
    });
    test('should fetch and adapt data correctly', async () => {
      await adapter.connect();
      const data = await adapter.fetchData();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      const record = data[0];
      expect(record).toHaveProperty('id');
      expect(record).toHaveProperty('timestamp');
      expect(record).toHaveProperty('value');
      expect(record).toHaveProperty('metadata');
      expect(record.metadata.source).toBe('api');
    });
    test('should throw error when fetching data without connection', async () => {
      await expect(adapter.fetchData()).rejects.toThrow('API not connected');
    });
  });
  describe('FileAdapter', () => {
    let adapter: FileAdapter;
    beforeEach(() => {
      adapter = new FileAdapter({
        directory: './test-data',
        filePattern: /\.json$/
      });
    });
    test('should connect successfully', async () => {
      await adapter.connect();
      expect(adapter.isConnected()).toBe(true);
    });
    test('should disconnect successfully', async () => {
      await adapter.connect();
      await adapter.disconnect();
      expect(adapter.isConnected()).toBe(false);
    });
    test('should fetch and adapt data correctly', async () => {
      await adapter.connect();
      const data = await adapter.fetchData();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
      const record = data[0];
      expect(record).toHaveProperty('id');
      expect(record).toHaveProperty('timestamp');
      expect(record).toHaveProperty('value');
      expect(record).toHaveProperty('metadata');
      expect(record.metadata.source).toBe('file');
    });
    test('should throw error when fetching data without connection', async () => {
      await expect(adapter.fetchData()).rejects.toThrow('File reader not connected');
    });
  });
});