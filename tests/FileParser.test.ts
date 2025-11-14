import * as fs from 'fs';
import * as path from 'path';
import { FileParser } from '../src/utils/FileParser';
import { ParseException } from '../src/exceptions/ParseException';

describe('FileParser', () => {
  let parser: FileParser;
  let testDataDir: string;

  beforeEach(() => {
    parser = new FileParser();
    testDataDir = path.join(__dirname, 'test-data');
    
    if (!fs.existsSync(testDataDir)) {
      fs.mkdirSync(testDataDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDataDir)) {
      const files = fs.readdirSync(testDataDir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(testDataDir, file));
      });
      fs.rmdirSync(testDataDir);
    }
  });

  describe('parseFile', () => {
    test('should parse file with valid numbers', () => {
      const filePath = path.join(testDataDir, 'valid.txt');
      fs.writeFileSync(filePath, '1 2 3\n4 5 6\n7 8 9');

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual([1, 2, 3]);
      expect(result[1]).toEqual([4, 5, 6]);
      expect(result[2]).toEqual([7, 8, 9]);
    });

    test('should parse file with negative numbers', () => {
      const filePath = path.join(testDataDir, 'negative.txt');
      fs.writeFileSync(filePath, '-1 -2 -3\n4.5 -5.5 6.7');

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual([-1, -2, -3]);
      expect(result[1]).toEqual([4.5, -5.5, 6.7]);
    });

    test('should parse file with decimal numbers', () => {
      const filePath = path.join(testDataDir, 'decimal.txt');
      fs.writeFileSync(filePath, '1.5 2.7 3.9\n0.1 0.2 0.3');

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual([1.5, 2.7, 3.9]);
      expect(result[1]).toEqual([0.1, 0.2, 0.3]);
    });

    test('should skip lines with invalid characters', () => {
      const filePath = path.join(testDataDir, 'invalid-chars.txt');
      fs.writeFileSync(filePath, '1 2 3\n4a 5 6\n7 8 9');

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual([1, 2, 3]);
      expect(result[1]).toEqual([7, 8, 9]);
    });

    test('should skip empty lines', () => {
      const filePath = path.join(testDataDir, 'empty-lines.txt');
      fs.writeFileSync(filePath, '1 2 3\n\n4 5 6\n  \n7 8 9');

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual([1, 2, 3]);
      expect(result[1]).toEqual([4, 5, 6]);
      expect(result[2]).toEqual([7, 8, 9]);
    });

    test('should handle mixed valid and invalid lines', () => {
      const filePath = path.join(testDataDir, 'mixed.txt');
      fs.writeFileSync(
        filePath,
        '1 2 3\ninvalid data\n4 5 6\n7.a 8 9\n10 11 12',
      );

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual([1, 2, 3]);
      expect(result[1]).toEqual([4, 5, 6]);
      expect(result[2]).toEqual([10, 11, 12]);
    });

    test('should handle different whitespace separators', () => {
      const filePath = path.join(testDataDir, 'whitespace.txt');
      fs.writeFileSync(filePath, '1  2   3\n4\t5\t6\n7    8     9');

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual([1, 2, 3]);
      expect(result[1]).toEqual([4, 5, 6]);
      expect(result[2]).toEqual([7, 8, 9]);
    });

    test('should throw error for non-existent file', () => {
      const filePath = path.join(testDataDir, 'non-existent.txt');

      expect(() => parser.parseFile(filePath)).toThrow(ParseException);
      expect(() => parser.parseFile(filePath)).toThrow(/File not found/);
    });

    test('should parse file with scientific notation', () => {
      const filePath = path.join(testDataDir, 'scientific.txt');
      fs.writeFileSync(filePath, '1e2 2e-1 3e+1');

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(1);
      expect(result[0][0]).toBe(100);
      expect(result[0][1]).toBe(0.2);
      expect(result[0][2]).toBe(30);
    });

    test('should parse file with zero values', () => {
      const filePath = path.join(testDataDir, 'zeros.txt');
      fs.writeFileSync(filePath, '0 0 0\n0.0 -0 +0');

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual([0, 0, 0]);
      expect(result[1][0] == 0).toBe(true);
      expect(result[1][1] == 0).toBe(true);
      expect(result[1][2] == 0).toBe(true);
      expect(Array.isArray(result[1])).toBe(true);
    });

    test('should return empty array for file with only invalid lines', () => {
      const filePath = path.join(testDataDir, 'all-invalid.txt');
      fs.writeFileSync(filePath, 'abc def\nxyz\ninvalid');

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    test('should handle large numbers', () => {
      const filePath = path.join(testDataDir, 'large.txt');
      fs.writeFileSync(filePath, '999999999 -999999999 0.123456789');

      const result = parser.parseFile(filePath);

      expect(result).toHaveLength(1);
      expect(result[0][0]).toBe(999999999);
      expect(result[0][1]).toBe(-999999999);
      expect(result[0][2]).toBeCloseTo(0.123456789, 9);
    });
  });
});
