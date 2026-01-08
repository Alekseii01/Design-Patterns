# Data Processing System

A data processing system from different sources using **Adapter** and **Visitor** design patterns.

## Description

This system demonstrates the implementation of two important design patterns:

- **Adapter Pattern** - adapts interfaces of various data sources (database, API, files) to a unified standard interface
- **Visitor Pattern** - allows adding new data processing operations without changing the structure of data classes

## Architecture

### Core Components:

1. **Data Sources** (`src/data-sources/`):
   - `DatabaseClient` - database client
   - `ApiClient` - REST API client
   - `FileReader` - file reader

2. **Adapters** (`src/adapters/`):
   - `DatabaseAdapter` - adapts DatabaseClient to common interface
   - `ApiAdapter` - adapts ApiClient to common interface  
   - `FileAdapter` - adapts FileReader to common interface

3. **Visitors** (`src/visitors/`):
   - `StatisticsVisitor` - calculates data statistics
   - `FilterVisitor` - filters data by criteria
   - `GroupingVisitor` - groups data
   - `ExportVisitor` - exports data to various formats
   - `ValidationVisitor` - validates data

4. **Main Classes**:
   - `DataProcessor` - main system management class
   - `DataCollection` - data collection with Visitor support

## Quick Start

### Install Dependencies

```bash
npm install
```

### Build Project

```bash
npm run build
```

### Run Demo

```bash
npm run demo
```

### Development with Auto-restart

```bash
npm run dev
```

## Usage

### Basic Example

```typescript
import { 
  DataProcessor,
  DatabaseAdapter,
  ApiAdapter,
  FileAdapter,
  StatisticsVisitor,
  FilterVisitor
} from './src';

const processor = new DataProcessor();

const dbAdapter = new DatabaseAdapter({
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  username: 'user',
  password: 'pass'
});

const apiAdapter = new ApiAdapter({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key',
  timeout: 5000
});

processor.registerDataSource('database', dbAdapter);
processor.registerDataSource('api', apiAdapter);

await processor.connectToAllSources();
await processor.loadDataFromAllSources();

const statsResult = processor.processData(new StatisticsVisitor());
console.log('Statistics:', statsResult.result);

const filteredResult = processor.processData(
  new FilterVisitor({ minValue: 10, maxValue: 100 })
);
console.log('Filtered data:', filteredResult.result);
```

### Creating Custom Visitor

```typescript
import { BaseDataVisitor, DataRecord } from './src';

class CustomVisitor extends BaseDataVisitor {
  private customData: any[] = [];

  visitRecord(record: DataRecord): void {
    if (record.value > 50) {
      this.customData.push({
        id: record.id,
        processedValue: record.value * 2
      });
    }
  }

  visitCollection(records: DataRecord[]): any {
    this.result.result = {
      processedRecords: this.customData,
      totalProcessed: this.customData.length
    };
    return this.result.result;
  }
}

const customResult = processor.processData(new CustomVisitor());
```

## Adapter Configuration

### Database
```typescript
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'sensors',
  username: 'admin',
  password: 'secret'
};
const dbAdapter = new DatabaseAdapter(dbConfig);
```

### API
```typescript
const apiConfig = {
  baseUrl: 'https://api.weather.com',
  apiKey: 'your-api-key',
  timeout: 5000
};
const apiAdapter = new ApiAdapter(apiConfig, '/data/latest');
```

### Files
```typescript
const fileConfig = {
  directory: './data',
  filePattern: /\.json$/
};
const fileAdapter = new FileAdapter(fileConfig);
```

## Built-in Visitors

### StatisticsVisitor
Calculates statistics: average, median, min/max, standard deviation

### FilterVisitor
Filters data by criteria:
- Value ranges
- Time periods
- Data sources
- Custom functions

### GroupingVisitor
Groups data by:
- Data source
- Time periods (hour, day)
- Value ranges
- Custom criteria

### ExportVisitor
Exports data to formats:
- JSON
- CSV  
- XML

### ValidationVisitor
Validates data according to rules:
- Required fields
- Value ranges
- Time constraints
- Custom validators

## Testing

```bash
npm test
npm run test:watch
npm test -- --coverage
```

## Project Structure

```
src/
├── adapters/           
├── data-sources/       
├── visitors/           
├── data-collection.ts  
├── data-processor.ts   
├── types.ts           
├── demo.ts            
└── index.ts           
```

## Design Patterns

### Adapter Pattern
Allows objects with incompatible interfaces to work together. In our system, adapters bring various data sources to a unified `DataSource` interface.

### Visitor Pattern  
Allows adding new operations to objects without changing their structure. Visitors can process data in various ways without modifying `DataRecord` or `DataCollection` classes.

## System Extension

### Adding New Data Source
1. Create data source class in `src/data-sources/`
2. Create corresponding adapter in `src/adapters/`
3. Register adapter in `DataProcessor`

### Adding New Visitor
1. Inherit from `BaseDataVisitor`
2. Implement `visitRecord` and `visitCollection` methods
3. Use with `DataProcessor.processData()`

## License

MIT License