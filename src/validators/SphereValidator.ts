import { ValidationException } from '../exceptions/ValidationException';

export class SphereValidator {
  private static readonly EPSILON = 1e-10;

  public validateRadius(radius: number): void {
    if (radius <= SphereValidator.EPSILON) {
      throw new ValidationException('Sphere radius must be positive');
    }
    if (Number.isNaN(radius) || !Number.isFinite(radius)) {
      throw new ValidationException('Sphere radius must be a valid finite number');
    }
  }

  public validateSurfaceArea(area: number): void {
    if (area < 0 || Number.isNaN(area) || !Number.isFinite(area)) {
      throw new ValidationException('Sphere surface area must be a non-negative finite number');
    }
  }

  public validateVolume(volume: number): void {
    if (volume < 0 || Number.isNaN(volume) || !Number.isFinite(volume)) {
      throw new ValidationException('Sphere volume must be a non-negative finite number');
    }
  }

  public validateVolumeRatio(ratio: number): void {
    if (ratio < 0 || ratio > 1 || Number.isNaN(ratio) || !Number.isFinite(ratio)) {
      throw new ValidationException('Volume ratio must be between 0 and 1');
    }
  }
}
