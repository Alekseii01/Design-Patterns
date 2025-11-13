import * as fs from 'fs';
import * as path from 'path';
import { ParseException } from '../exceptions/ParseException';
import { logger } from './logger';

const NUMBER_PATTERN = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;

export class FileParser {
  private isValidNumber(value: string): boolean {
    return NUMBER_PATTERN.test(value.trim());
  }

  private parseNumber(value: string): number {
    const trimmed = value.trim();
    if (!this.isValidNumber(trimmed)) {
      throw new ParseException(`Invalid number format: ${value}`);
    }
    const parsedValue = parseFloat(trimmed);
    if (Number.isNaN(parsedValue) || !Number.isFinite(parsedValue)) {
      throw new ParseException(`Invalid number value: ${value}`);
    }
    return parsedValue;
  }

  public parseFile(filePath: string): number[][] {
    try {
      const absolutePath = path.resolve(filePath);
      logger.info(`Reading file: ${absolutePath}`);

      if (!fs.existsSync(absolutePath)) {
        throw new ParseException(`File not found: ${absolutePath}`);
      }

      const fileContent = fs.readFileSync(absolutePath, 'utf-8');
      const lines = fileContent.split('\n');
      const parsedData: number[][] = [];

      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();

        if (trimmedLine.length === 0) {
          return;
        }

        try {
          const values = trimmedLine.split(/\s+/);
          const numbers = values.map((value) => this.parseNumber(value));
          parsedData.push(numbers);
          logger.info(`Line ${lineNumber}: Successfully parsed ${numbers.length} numbers`);
        } catch (error) {
          if (error instanceof ParseException) {
            logger.warn(`Line ${lineNumber}: Skipped - ${error.message}`);
          } else {
            logger.error(`Line ${lineNumber}: Unexpected error - ${error}`);
          }
        }
      });

      logger.info(`File parsing completed. Valid lines: ${parsedData.length}`);
      return parsedData;
    } catch (error) {
      if (error instanceof ParseException) {
        throw error;
      }
      throw new ParseException(`Error reading file: ${error}`);
    }
  }
}
