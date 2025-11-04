/**
 * BusinessUser Domain Entity
 *
 * This is the core domain entity representing the relationship between
 * a User and a Business with a specific role.
 * It contains business logic and is independent of any infrastructure concerns.
 *
 * @module core/domain/entities
 */

export enum BusinessRole {
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export interface BusinessUserProps {
  id?: number;
  userId: string; // Firebase UID
  businessId: number;
  role: BusinessRole;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * BusinessUser Entity
 *
 * Represents the relationship between a User and a Business.
 * Contains business rules and validations.
 */
export class BusinessUser {
  private _id?: number;
  private readonly _userId: string;
  private readonly _businessId: number;
  private _role: BusinessRole;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: BusinessUserProps) {
    // Validations
    if (!props.userId || props.userId.trim() === "") {
      throw new Error("User ID is required");
    }
    if (!props.businessId || props.businessId <= 0) {
      throw new Error("Business ID must be a positive number");
    }
    if (!props.role) {
      throw new Error("Role is required");
    }

    this._id = props.id;
    this._userId = props.userId;
    this._businessId = props.businessId;
    this._role = props.role;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get businessId(): number {
    return this._businessId;
  }

  get role(): BusinessRole {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business Logic Methods

  /**
   * Check if user is a manager
   */
  isManager(): boolean {
    return this._role === BusinessRole.MANAGER;
  }

  /**
   * Check if user is an employee
   */
  isEmployee(): boolean {
    return this._role === BusinessRole.EMPLOYEE;
  }

  /**
   * Change user role
   */
  changeRole(newRole: BusinessRole): void {
    if (!newRole) {
      throw new Error("Role is required");
    }
    this._role = newRole;
    this.touch();
  }

  /**
   * Promote to manager
   */
  promoteToManager(): void {
    this._role = BusinessRole.MANAGER;
    this.touch();
  }

  /**
   * Demote to employee
   */
  demoteToEmployee(): void {
    this._role = BusinessRole.EMPLOYEE;
    this.touch();
  }

  // Private helper methods

  private touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Convert entity to plain object (for persistence)
   */
  toObject(): BusinessUserProps {
    return {
      id: this._id,
      userId: this._userId,
      businessId: this._businessId,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * Create BusinessUser from plain object
   */
  static fromObject(props: BusinessUserProps): BusinessUser {
    return new BusinessUser(props);
  }
}
