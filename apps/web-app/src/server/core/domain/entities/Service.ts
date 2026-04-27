/**
 * Service Domain Entity
 *
 * This is the core domain entity representing a Service in the system.
 * It contains business logic and is independent of any infrastructure concerns.
 *
 * @module core/domain/entities
 */

import Decimal from "decimal.js";

export interface ServiceProps {
  id?: string;
  businessId: string;
  categoryId?: string | null;
  name: string;
  description?: string | null;
  price: Decimal | number | string;
  durationMinutes: number;
  active?: boolean;
  isVirtual?: boolean;
  requiresOnlinePayment?: boolean;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Service Entity
 *
 * Represents a service offered by a business.
 * Contains business rules and validations.
 */
export class Service {
  private _id?: string;
  private _businessId: string;
  private _categoryId: string | null;
  private _name: string;
  private _description: string | null;
  private _price: Decimal;
  private _durationMinutes: number;
  private _active: boolean;
  private _isVirtual: boolean;
  private _requiresOnlinePayment: boolean;
  private _images: string[];
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ServiceProps) {
    // Validations
    if (!props.businessId || props.businessId.trim() === "") {
      throw new Error("Business ID is required");
    }
    if (!props.name || props.name.trim() === "") {
      throw new Error("Service name is required");
    }
    if (props.name.length > 255) {
      throw new Error("Service name must be at most 255 characters");
    }

    // Price validation
    const price = new Decimal(props.price);
    if (price.isNegative()) {
      throw new Error("Price cannot be negative");
    }
    if (price.decimalPlaces() > 2) {
      throw new Error("Price can have at most 2 decimal places");
    }

    // Duration validation
    if (!Number.isInteger(props.durationMinutes)) {
      throw new Error("Duration must be an integer");
    }
    if (props.durationMinutes <= 0) {
      throw new Error("Duration must be a positive number");
    }
    if (props.durationMinutes > 1440) {
      // Max 24 hours
      throw new Error("Duration cannot exceed 24 hours (1440 minutes)");
    }

    this._id = props.id;
    this._businessId = props.businessId;
    this._categoryId = props.categoryId || null;
    this._name = props.name.trim();
    this._description = props.description || null;
    this._price = price;
    this._durationMinutes = props.durationMinutes;
    this._active = props.active !== undefined ? props.active : true;
    this._isVirtual = props.isVirtual ?? false;
    this._requiresOnlinePayment = props.requiresOnlinePayment ?? false;
    this._images = props.images || [];
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): string | undefined {
    return this._id;
  }

  get businessId(): string {
    return this._businessId;
  }

  get categoryId(): string | null {
    return this._categoryId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get price(): Decimal {
    return this._price;
  }

  get priceAsNumber(): number {
    return this._price.toNumber();
  }

  get priceAsString(): string {
    return this._price.toFixed(2);
  }

  get durationMinutes(): number {
    return this._durationMinutes;
  }

  get active(): boolean {
    return this._active;
  }

  get isVirtual(): boolean {
    return this._isVirtual;
  }

  get requiresOnlinePayment(): boolean {
    return this._requiresOnlinePayment;
  }

  get images(): string[] {
    return this._images;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business Logic Methods

  /**
   * Check if service is active
   */
  isActive(): boolean {
    return this._active;
  }

  /**
   * Activate the service
   */
  activate(): void {
    this._active = true;
    this.touch();
  }

  /**
   * Deactivate the service
   */
  deactivate(): void {
    this._active = false;
    this.touch();
  }

  /**
   * Update service name
   */
  updateName(name: string): void {
    if (!name || name.trim() === "") {
      throw new Error("Service name cannot be empty");
    }
    if (name.length > 255) {
      throw new Error("Service name must be at most 255 characters");
    }
    this._name = name.trim();
    this.touch();
  }

  /**
   * Update service description
   */
  updateDescription(description: string | null): void {
    this._description = description;
    this.touch();
  }

  /**
   * Update service price
   */
  updatePrice(price: Decimal | number | string): void {
    const newPrice = new Decimal(price);
    if (newPrice.isNegative()) {
      throw new Error("Price cannot be negative");
    }
    if (newPrice.decimalPlaces() > 2) {
      throw new Error("Price can have at most 2 decimal places");
    }
    this._price = newPrice;
    this.touch();
  }

  /**
   * Update service duration
   */
  updateDuration(durationMinutes: number): void {
    if (!Number.isInteger(durationMinutes)) {
      throw new Error("Duration must be an integer");
    }
    if (durationMinutes <= 0) {
      throw new Error("Duration must be a positive number");
    }
    if (durationMinutes > 1440) {
      throw new Error("Duration cannot exceed 24 hours (1440 minutes)");
    }
    this._durationMinutes = durationMinutes;
    this.touch();
  }

  /**
   * Update service category
   */
  updateCategory(categoryId: string | null): void {
    this._categoryId = categoryId;
    this.touch();
  }

  /**
   * Update multiple service properties at once
   */
  updateInfo(data: {
    name?: string;
    description?: string | null;
    price?: Decimal | number | string;
    durationMinutes?: number;
    categoryId?: string | null;
    active?: boolean;
    isVirtual?: boolean;
    requiresOnlinePayment?: boolean;
  }): void {
    if (data.name !== undefined) {
      this.updateName(data.name);
    }
    if (data.description !== undefined) {
      this.updateDescription(data.description);
    }
    if (data.price !== undefined) {
      this.updatePrice(data.price);
    }
    if (data.durationMinutes !== undefined) {
      this.updateDuration(data.durationMinutes);
    }
    if (data.categoryId !== undefined) {
      this.updateCategory(data.categoryId);
    }
    if (data.active !== undefined) {
      this._active = data.active;
      this.touch();
    }
    if (data.isVirtual !== undefined) {
      this._isVirtual = data.isVirtual;
      this.touch();
    }
    if (data.requiresOnlinePayment !== undefined) {
      this._requiresOnlinePayment = data.requiresOnlinePayment;
      this.touch();
    }
  }

  /**
   * Get formatted duration (e.g., "1h 30m")
   */
  getFormattedDuration(): string {
    const hours = Math.floor(this._durationMinutes / 60);
    const minutes = this._durationMinutes % 60;

    if (hours === 0) {
      return `${minutes}m`;
    }
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  }

  // Private helper methods

  private touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Convert entity to plain object (for persistence)
   */
  toObject(): ServiceProps & { price: Decimal } {
    return {
      id: this._id,
      businessId: this._businessId,
      categoryId: this._categoryId,
      name: this._name,
      description: this._description,
      price: this._price,
      durationMinutes: this._durationMinutes,
      active: this._active,
      isVirtual: this._isVirtual,
      requiresOnlinePayment: this._requiresOnlinePayment,
      images: this._images,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * Create Service from plain object
   */
  static fromObject(props: ServiceProps): Service {
    return new Service(props);
  }
}
