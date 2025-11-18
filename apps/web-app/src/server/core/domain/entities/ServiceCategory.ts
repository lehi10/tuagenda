/**
 * ServiceCategory Domain Entity
 *
 * This is the core domain entity representing a Service Category in the system.
 * It contains business logic and is independent of any infrastructure concerns.
 *
 * @module core/domain/entities
 */

export interface ServiceCategoryProps {
  id?: string;
  businessId: string;
  name: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * ServiceCategory Entity
 *
 * Represents a category for grouping services in a business.
 * Contains business rules and validations.
 */
export class ServiceCategory {
  private _id?: string;
  private _businessId: string;
  private _name: string;
  private _description: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ServiceCategoryProps) {
    // Validations
    if (!props.businessId || props.businessId.trim() === "") {
      throw new Error("Business ID is required");
    }
    if (!props.name || props.name.trim() === "") {
      throw new Error("Category name is required");
    }
    if (props.name.length > 255) {
      throw new Error("Category name must be at most 255 characters");
    }

    this._id = props.id;
    this._businessId = props.businessId;
    this._name = props.name.trim();
    this._description = props.description || null;
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

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business Logic Methods

  /**
   * Update category name
   */
  updateName(name: string): void {
    if (!name || name.trim() === "") {
      throw new Error("Category name cannot be empty");
    }
    if (name.length > 255) {
      throw new Error("Category name must be at most 255 characters");
    }
    this._name = name.trim();
    this.touch();
  }

  /**
   * Update category description
   */
  updateDescription(description: string | null): void {
    this._description = description;
    this.touch();
  }

  /**
   * Update category information
   */
  updateInfo(data: { name?: string; description?: string | null }): void {
    if (data.name !== undefined) {
      this.updateName(data.name);
    }
    if (data.description !== undefined) {
      this.updateDescription(data.description);
    }
  }

  // Private helper methods

  private touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Convert entity to plain object (for persistence)
   */
  toObject(): ServiceCategoryProps {
    return {
      id: this._id,
      businessId: this._businessId,
      name: this._name,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * Create ServiceCategory from plain object
   */
  static fromObject(props: ServiceCategoryProps): ServiceCategory {
    return new ServiceCategory(props);
  }
}
