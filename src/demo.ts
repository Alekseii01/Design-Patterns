import { DataProcessor } from './data-processor';
import { DatabaseAdapter } from './adapters/database-adapter';
import { ApiAdapter } from './adapters/api-adapter';
import { FileAdapter } from './adapters/file-adapter';
import { 
  StatisticsVisitor, 
  FilterVisitor, 
  GroupingVisitor 
} from './visitors/data-visitors';
import { 
  ExportVisitor, 
  ValidationVisitor 
} from './visitors/export-validation-visitors';
export async function demonstrateDataProcessingSystem(): Promise<void> {
  console.log(' Starting Data Processing System Demo\n');
  const processor = new DataProcessor();
  console.log(' Setting up data sources...');
  const dbAdapter = new DatabaseAdapter({
    host: 'localhost',
    port: 5432,
    database: 'sensors',
    username: 'admin',
    password: 'secret'
  });
  const apiAdapter = new ApiAdapter({
    baseUrl: 'https://api.example.com',
    apiKey: 'api-key-123',
    timeout: 5000
  }, '/sensors/latest');
  const fileAdapter = new FileAdapter({
    directory: './data',
    filePattern: /\.json$/
  });
  processor.registerDataSource('database', dbAdapter);
  processor.registerDataSource('weather-api', apiAdapter);
  processor.registerDataSource('local-files', fileAdapter);
  console.log(' Registered data sources:', processor.getDataSources().join(', '));
  console.log();
  try {
    console.log(' Connecting to all data sources...');
    await processor.connectToAllSources();
    console.log();
    console.log(' Loading data from all sources...');
    const allRecords = await processor.loadDataFromAllSources();
    console.log(` Total records loaded: ${allRecords.length}\n`);
    console.log(' Processing data with Statistics Visitor...');
    const statisticsVisitor = new StatisticsVisitor();
    const statsResult = processor.processData(statisticsVisitor);
    console.log('Statistics Results:', JSON.stringify(statsResult.result, null, 2));
    console.log();
    console.log(' Processing data with Filter Visitor...');
    const filterVisitor = new FilterVisitor({
      minValue: 20,
      maxValue: 50,
      sources: ['database', 'weather-api']
    });
    const filterResult = processor.processData(filterVisitor);
    console.log('Filter Results:');
    console.log(`- Original records: ${filterResult.result.originalCount}`);
    console.log(`- Filtered records: ${filterResult.result.filteredCount}`);
    console.log(`- Filter criteria:`, filterResult.result.criteria);
    console.log();
    console.log(' Processing data with Grouping Visitor (by source)...');
    const groupingVisitor = new GroupingVisitor(GroupingVisitor.groupBySource());
    const groupResult = processor.processData(groupingVisitor);
    console.log('Grouping Results:');
    console.log(`- Total groups: ${groupResult.result.totalGroups}`);
    for (const [groupName, groupData] of Object.entries(groupResult.result.groups)) {
      console.log(`  - ${groupName}: ${(groupData as any).count} records`);
    }
    console.log();
    console.log(' Processing data with Export Visitor (JSON)...');
    const exportVisitor = new ExportVisitor('json', { 
      includeMetadata: true,
      indentation: 2 
    });
    const exportResult = processor.processData(exportVisitor);
    console.log('Export Results:');
    console.log(`- Format: ${exportResult.result.format}`);
    console.log(`- Record count: ${exportResult.result.recordCount}`);
    console.log(`- Export size: ${exportResult.result.size} characters`);
    console.log(`- First 200 chars: ${exportResult.result.exportedData.substring(0, 200)}...`);
    console.log();
    console.log(' Processing data with Validation Visitor...');
    const validationVisitor = new ValidationVisitor({
      valueRange: { min: 0, max: 100 },
      customValidators: [
        {
          name: 'ID Format',
          validator: (record) => record.id.length > 0,
          message: 'ID should not be empty'
        },
        {
          name: 'Timestamp Valid',
          validator: (record) => record.timestamp instanceof Date && !isNaN(record.timestamp.getTime()),
          message: 'Timestamp should be a valid date'
        }
      ]
    });
    const validationResult = processor.processData(validationVisitor);
    console.log('Validation Results:');
    console.log(`- Total records: ${validationResult.result.totalRecords}`);
    console.log(`- Valid records: ${validationResult.result.validRecords}`);
    console.log(`- Invalid records: ${validationResult.result.invalidRecords}`);
    console.log(`- Validation rate: ${(validationResult.result.validationRate * 100).toFixed(1)}%`);
    console.log();
    console.log(' Processing with multiple visitors sequentially...');
    const multipleResults = processor.processDataWithMultipleVisitors([
      new StatisticsVisitor(),
      new GroupingVisitor(GroupingVisitor.groupByHour()),
      new ExportVisitor('csv')
    ]);
    console.log(` Processed with ${multipleResults.length} visitors`);
    multipleResults.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.type} - completed at ${result.timestamp.toISOString()}`);
    });
    console.log();
    console.log('ℹSystem Information:');
    const systemInfo = processor.getSystemInfo();
    console.log(JSON.stringify(systemInfo, null, 2));
  } catch (error) {
    console.error('Error during demo:', error);
  } finally {
    console.log('\n Disconnecting from all data sources...');
    await processor.disconnectFromAllSources();
    console.log('Demo completed successfully!');
  }
}
export async function demonstrateIndividualComponents(): Promise<void> {
  console.log('\nIndividual Components Demo\n');
  console.log(' Testing Database Adapter individually...');
  const dbAdapter = new DatabaseAdapter({
    host: 'localhost',
    port: 5432,
    database: 'test',
    username: 'user',
    password: 'pass'
  });
  try {
    await dbAdapter.connect();
    const dbData = await dbAdapter.fetchData();
    console.log(`Database adapter fetched ${dbData.length} records`);
    console.log('Sample record:', dbData[0]);
    await dbAdapter.disconnect();
  } catch (error) {
    console.error('Database adapter error:', error);
  }
  console.log('\n Testing different export formats...');
  const testData = [
    {
      id: 'test-001',
      timestamp: new Date(),
      value: 42.5,
      metadata: { source: 'test', type: 'demo' }
    },
    {
      id: 'test-002',
      timestamp: new Date(Date.now() + 60000),
      value: 38.2,
      metadata: { source: 'test', type: 'demo' }
    }
  ];
  const formats: Array<'json' | 'csv' | 'xml'> = ['json', 'csv', 'xml'];
  for (const format of formats) {
    console.log(`\nExport to ${format.toUpperCase()}:`);
    const exportVisitor = new ExportVisitor(format);
    exportVisitor.visitCollection(testData);
    const result = exportVisitor.getResult();
    console.log(`Size: ${result.result.size} characters`);
    console.log(`Preview: ${result.result.exportedData.substring(0, 150)}...`);
  }
}
export async function runFullDemo(): Promise<void> {
  await demonstrateDataProcessingSystem();
  await demonstrateIndividualComponents();
}
if (require.main === module) {
  runFullDemo().catch(console.error);
}