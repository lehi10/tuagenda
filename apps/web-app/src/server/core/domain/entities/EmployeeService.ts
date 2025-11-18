/**
 * EmployeeService Domain Entity
 *
 * This is the core domain entity representing the assignment of a Service to an Employee.
 * It's a relationship entity that links BusinessUser (employee) with Service.
 *
 * @module core/domain/entities
 */

export interface EmployeeServiceProps {
  businessUserId: string;
  serviceId: string;
  businessId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * EmployeeService Entity
 *
 * Represents the assignment of a service to an employee.
 * Contains business rules and validations.
 */
export class EmployeeService {
  private readonly _businessUserId: string;
  private readonly _serviceId: string;
  private readonly _businessId: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: EmployeeServiceProps) {
    // Validations
    if (!props.businessUserId || props.businessUserId.trim() === "") {
      throw new Error("Business User ID is required");
    }
    if (!props.serviceId || props.serviceId.trim() === "") {
      throw new Error("Service ID is required");
    }
    if (!props.businessId || props.businessId.trim() === "") {
      throw new Error("Business ID is required");
    }

    this._businessUserId = props.businessUserId;
    this._serviceId = props.serviceId;
    this._businessId = props.businessId;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get businessUserId(): string {
    return this._businessUserId;
  }

  get serviceId(): string {
    return this._serviceId;
  }

  get businessId(): string {
    return this._businessId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business Logic Methods

  /**
   * Check if this assignment matches the given employee and service
   */
  matches(businessUserId: string, serviceId: string): boolean {
    return (
      this._businessUserId === businessUserId && this._serviceId === serviceId
    );
  }

  /**
   * Check if this assignment belongs to the given business
   */
  belongsToBusiness(businessId: string): boolean {
    return this._businessId === businessId;
  }

  /**
   * Check if this assignment is for the given employee
   */
  isForEmployee(businessUserId: string): boolean {
    return this._businessUserId === businessUserId;
  }

  /**
   * Check if this assignment is for the given service
   */
  isForService(serviceId: string): boolean {
    return this._serviceId === serviceId;
  }

  /**
   * Get the composite key for this assignment
   */
  getCompositeKey(): string {
    return `${this._businessUserId}:${this._serviceId}`;
  }

  // Private helper methods

  private touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Convert entity to plain object (for persistence)
   */
  toObject(): EmployeeServiceProps {
    return {
      businessUserId: this._businessUserId,
      serviceId: this._serviceId,
      businessId: this._businessId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * Create EmployeeService from plain object
   */
  static fromObject(props: EmployeeServiceProps): EmployeeService {
    return new EmployeeService(props);
  }
}
