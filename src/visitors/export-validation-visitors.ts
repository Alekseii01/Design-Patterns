import { DataRecord } from '../types';
import { BaseDataVisitor } from './data-visitors';
export class ExportVisitor extends BaseDataVisitor {
  private format: 'json' | 'csv' | 'xml';
  private options: {
    includeMetadata?: boolean;
    dateFormat?: 'iso' | 'timestamp' | 'locale';
    separator?: string;
    indentation?: number;
  };
  constructor(
    format: 'json' | 'csv' | 'xml' = 'json', 
    options: ExportVisitor['options'] = {}
  ) {
    super();
    this.format = format;
    this.options = {
      includeMetadata: true,
      dateFormat: 'iso',
      separator: ',',
      indentation: 2,
      ...options
    };
  }
  visitRecord(_record: DataRecord): void {
  }
  visitCollection(records: DataRecord[]): any {
    let exportedData: string;
    try {
      switch (this.format) {
        case 'json':
          exportedData = this.exportToJSON(records);
          break;
        case 'csv':
          exportedData = this.exportToCSV(records);
          break;
        case 'xml':
          exportedData = this.exportToXML(records);
          break;
        default:
          throw new Error(`Unsupported export format: ${this.format}`);
      }
      this.result.result = {
        format: this.format,
        recordCount: records.length,
        exportedData: exportedData,
        size: exportedData.length,
        options: this.options
      };
    } catch (error) {
      this.result.result = {
        error: `Failed to export data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        format: this.format,
        recordCount: records.length
      };
    }
    return this.result.result;
  }
  private exportToJSON(records: DataRecord[]): string {
    const processedRecords = records.map(record => ({
      id: record.id,
      timestamp: this.formatDate(record.timestamp),
      value: record.value,
      ...(this.options.includeMetadata && { metadata: record.metadata })
    }));
    return JSON.stringify({
      exportInfo: {
        format: 'json',
        timestamp: new Date().toISOString(),
        count: records.length
      },
      data: processedRecords
    }, null, this.options.indentation);
  }
  private exportToCSV(records: DataRecord[]): string {
    const separator = this.options.separator || ',';
    const headers = this.options.includeMetadata 
      ? ['id', 'timestamp', 'value', 'metadata']
      : ['id', 'timestamp', 'value'];
    const csvRows = [headers.join(separator)];
    for (const record of records) {
      const row = [
        this.escapeCsvValue(record.id),
        this.escapeCsvValue(this.formatDate(record.timestamp)),
        record.value.toString(),
        ...(this.options.includeMetadata 
          ? [this.escapeCsvValue(JSON.stringify(record.metadata))] 
          : [])
      ];
      csvRows.push(row.join(separator));
    }
    return csvRows.join('\n');
  }
  private exportToXML(records: DataRecord[]): string {
    const indent = ' '.repeat(this.options.indentation || 2);
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<dataExport>\n';
    xml += `${indent}<exportInfo>\n`;
    xml += `${indent}${indent}<format>xml</format>\n`;
    xml += `${indent}${indent}<timestamp>${new Date().toISOString()}</timestamp>\n`;
    xml += `${indent}${indent}<count>${records.length}</count>\n`;
    xml += `${indent}</exportInfo>\n`;
    xml += `${indent}<records>\n`;
    for (const record of records) {
      xml += `${indent}${indent}<record>\n`;
      xml += `${indent}${indent}${indent}<id>${this.escapeXml(record.id)}</id>\n`;
      xml += `${indent}${indent}${indent}<timestamp>${this.formatDate(record.timestamp)}</timestamp>\n`;
      xml += `${indent}${indent}${indent}<value>${record.value}</value>\n`;
      if (this.options.includeMetadata) {
        xml += `${indent}${indent}${indent}<metadata>\n`;
        for (const [key, value] of Object.entries(record.metadata)) {
          xml += `${indent}${indent}${indent}${indent}<${key}>${this.escapeXml(JSON.stringify(value))}</${key}>\n`;
        }
        xml += `${indent}${indent}${indent}</metadata>\n`;
      }
      xml += `${indent}${indent}</record>\n`;
    }
    xml += `${indent}</records>\n`;
    xml += '</dataExport>';
    return xml;
  }
  private formatDate(date: Date): string {
    switch (this.options.dateFormat) {
      case 'timestamp':
        return date.getTime().toString();
      case 'locale':
        return date.toLocaleString();
      case 'iso':
      default:
        return date.toISOString();
    }
  }
  private escapeCsvValue(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
export class ValidationVisitor extends BaseDataVisitor {
  private validationRules: {
    requiredFields?: (keyof DataRecord)[];
    valueRange?: { min: number; max: number };
    timestampRange?: { start: Date; end: Date };
    customValidators?: Array<{
      name: string;
      validator: (record: DataRecord) => boolean;
      message: string;
    }>;
  };
  private validRecords: DataRecord[] = [];
  private invalidRecords: Array<{ record: DataRecord; errors: string[] }> = [];
  constructor(rules: ValidationVisitor['validationRules'] = {}) {
    super();
    this.validationRules = rules;
  }
  visitRecord(record: DataRecord): void {
    const errors: string[] = [];
    if (this.validationRules.requiredFields) {
      for (const field of this.validationRules.requiredFields) {
        if (record[field] === undefined || record[field] === null) {
          errors.push(`Missing required field: ${String(field)}`);
        }
      }
    }
    if (this.validationRules.valueRange) {
      const { min, max } = this.validationRules.valueRange;
      if (record.value < min || record.value > max) {
        errors.push(`Value ${record.value} is outside allowed range [${min}, ${max}]`);
      }
    }
    if (this.validationRules.timestampRange) {
      const { start, end } = this.validationRules.timestampRange;
      if (record.timestamp < start || record.timestamp > end) {
        errors.push(`Timestamp ${record.timestamp.toISOString()} is outside allowed range`);
      }
    }
    if (this.validationRules.customValidators) {
      for (const { name, validator, message } of this.validationRules.customValidators) {
        if (!validator(record)) {
          errors.push(`${name}: ${message}`);
        }
      }
    }
    if (errors.length === 0) {
      this.validRecords.push(record);
    } else {
      this.invalidRecords.push({ record, errors });
    }
  }
  visitCollection(records: DataRecord[]): any {
    this.result.result = {
      totalRecords: records.length,
      validRecords: this.validRecords.length,
      invalidRecords: this.invalidRecords.length,
      validationRate: records.length > 0 ? this.validRecords.length / records.length : 0,
      validRecordsList: this.validRecords,
      invalidRecordsList: this.invalidRecords,
      rules: this.validationRules
    };
    return this.result.result;
  }
}