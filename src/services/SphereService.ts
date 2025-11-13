import { Sphere } from '../entities/Sphere';
import { SphereValidator } from '../validators/SphereValidator';

export class SphereService {
  private static readonly EPSILON = 1e-10;

  private validator: SphereValidator;

  constructor() {
    this.validator = new SphereValidator();
  }

  public calculateSurfaceArea(sphere: Sphere): number {
    const radius = sphere.getRadius();
    const area = 4 * Math.PI * radius * radius;
    this.validator.validateSurfaceArea(area);
    return area;
  }

  public calculateVolume(sphere: Sphere): number {
    const radius = sphere.getRadius();
    const volume = (4 / 3) * Math.PI * radius * radius * radius;
    this.validator.validateVolume(volume);
    return volume;
  }

  public isSphere(sphere: Sphere): boolean {
    try {
      const radius = sphere.getRadius();
      this.validator.validateRadius(radius);
      return true;
    } catch (error) {
      return false;
    }
  }

  public touchesXYPlane(sphere: Sphere): boolean {
    const centerZ = sphere.getCenter().getZ();
    const radius = sphere.getRadius();
    return Math.abs(Math.abs(centerZ) - radius) < SphereService.EPSILON;
  }

  public touchesXZPlane(sphere: Sphere): boolean {
    const centerY = sphere.getCenter().getY();
    const radius = sphere.getRadius();
    return Math.abs(Math.abs(centerY) - radius) < SphereService.EPSILON;
  }

  public touchesYZPlane(sphere: Sphere): boolean {
    const centerX = sphere.getCenter().getX();
    const radius = sphere.getRadius();
    return Math.abs(Math.abs(centerX) - radius) < SphereService.EPSILON;
  }

  public touchesAnyCoordinatePlane(sphere: Sphere): boolean {
    return (
      this.touchesXYPlane(sphere)
      || this.touchesXZPlane(sphere)
      || this.touchesYZPlane(sphere)
    );
  }

  public calculateVolumeRatioXY(sphere: Sphere): number {
    const centerZ = sphere.getCenter().getZ();
    const radius = sphere.getRadius();

    if (Math.abs(centerZ) < SphereService.EPSILON) {
      return 0.5;
    }

    if (Math.abs(centerZ) >= radius) {
      return 0;
    }

    const h1 = radius - centerZ;
    const h2 = radius + centerZ;

    const volume1 = (Math.PI * h1 * h1 * (3 * radius - h1)) / 3;
    const volume2 = (Math.PI * h2 * h2 * (3 * radius - h2)) / 3;

    const minVolume = Math.min(volume1, volume2);
    const maxVolume = Math.max(volume1, volume2);

    const ratio = maxVolume > SphereService.EPSILON ? minVolume / maxVolume : 0;
    this.validator.validateVolumeRatio(ratio);
    return ratio;
  }

  public calculateVolumeRatioXZ(sphere: Sphere): number {
    const centerY = sphere.getCenter().getY();
    const radius = sphere.getRadius();

    if (Math.abs(centerY) < SphereService.EPSILON) {
      return 0.5;
    }

    if (Math.abs(centerY) >= radius) {
      return 0;
    }

    const h1 = radius - centerY;
    const h2 = radius + centerY;

    const volume1 = (Math.PI * h1 * h1 * (3 * radius - h1)) / 3;
    const volume2 = (Math.PI * h2 * h2 * (3 * radius - h2)) / 3;

    const minVolume = Math.min(volume1, volume2);
    const maxVolume = Math.max(volume1, volume2);

    const ratio = maxVolume > SphereService.EPSILON ? minVolume / maxVolume : 0;
    this.validator.validateVolumeRatio(ratio);
    return ratio;
  }

  public calculateVolumeRatioYZ(sphere: Sphere): number {
    const centerX = sphere.getCenter().getX();
    const radius = sphere.getRadius();

    if (Math.abs(centerX) < SphereService.EPSILON) {
      return 0.5;
    }

    if (Math.abs(centerX) >= radius) {
      return 0;
    }

    const h1 = radius - centerX;
    const h2 = radius + centerX;

    const volume1 = (Math.PI * h1 * h1 * (3 * radius - h1)) / 3;
    const volume2 = (Math.PI * h2 * h2 * (3 * radius - h2)) / 3;

    const minVolume = Math.min(volume1, volume2);
    const maxVolume = Math.max(volume1, volume2);

    const ratio = maxVolume > SphereService.EPSILON ? minVolume / maxVolume : 0;
    this.validator.validateVolumeRatio(ratio);
    return ratio;
  }
}
