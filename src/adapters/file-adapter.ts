import { DataSource, DataRecord } from '../types';
import { FileReader, FileConfig } from '../data-sources/file';
export class FileAdapter implements DataSource {
  private reader: FileReader;
  constructor(config: FileConfig) {
    this.reader = new FileReader(config);
  }
  async connect(): Promise<void> {
    await this.reader.connect();
  }
  async disconnect(): Promise<void> {
    await this.reader.disconnect();
  }
  async fetchData(): Promise<DataRecord[]> {
    const files = await this.reader.readFiles();
    const records: DataRecord[] = [];
    for (const file of files) {
      for (const entry of file.entries) {
        records.push({
          id: entry.id,
          timestamp: new Date(entry.date),
          value: entry.reading,
          metadata: {
            source: 'file',
            fileFormat: file.format,
            fileVersion: file.version,
            attributes: entry.attributes
          }
        });
      }
    }
    return records;
  }
  isConnected(): boolean {
    return this.reader.isConnected();
  }
}