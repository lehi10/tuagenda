/**
 * User Domain Entity
 *
 * This is the core domain entity representing a User in the system.
 * It contains business logic and is independent of any infrastructure concerns.
 *
 * @module core/domain/entities
 */

export enum UserStatus {
  HIDDEN = "hidden",
  VISIBLE = "visible",
  DISABLED = "disabled",
  BLOCKED = "blocked",
}

export enum UserType {
  CUSTOMER = "customer",
  ADMIN = "admin",
  SUPERADMIN = "superadmin",
}

export interface UserProps {
  id: string; // Firebase UID
  email: string;
  firstName: string;
  lastName: string;
  status?: UserStatus;
  type?: UserType;
  birthday?: Date | null;
  phone?: string | null;
  countryCode?: string | null;
  note?: string | null;
  description?: string | null;
  pictureFullPath?: string | null;
  timeZone?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User Entity
 *
 * Represents a user in the TuAgenda system.
 * Contains business rules and validations.
 */
export class User {
  private readonly _id: string;
  private _email: string;
  private _firstName: string;
  private _lastName: string;
  private _status: UserStatus;
  private _type: UserType;
  private _birthday: Date | null;
  private _phone: string | null;
  private _countryCode: string | null;
  private _note: string | null;
  private _description: string | null;
  private _pictureFullPath: string | null;
  private _timeZone: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: UserProps) {
    // Validations
    if (!props.id || props.id.trim() === "") {
      throw new Error("User ID is required");
    }
    if (!props.email || !this.isValidEmail(props.email)) {
      throw new Error("Valid email is required");
    }
    if (!props.firstName || props.firstName.trim() === "") {
      throw new Error("First name is required");
    }
    if (!props.lastName || props.lastName.trim() === "") {
      throw new Error("Last name is required");
    }

    this._id = props.id;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._status = props.status || UserStatus.VISIBLE;
    this._type = props.type || UserType.CUSTOMER;
    this._birthday = props.birthday || null;
    this._phone = props.phone || null;
    this._countryCode = props.countryCode || null;
    this._note = props.note || null;
    this._description = props.description || null;
    this._pictureFullPath = props.pictureFullPath || null;
    this._timeZone = props.timeZone || null;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get fullName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  get status(): UserStatus {
    return this._status;
  }

  get type(): UserType {
    return this._type;
  }

  get birthday(): Date | null {
    return this._birthday;
  }

  get phone(): string | null {
    return this._phone;
  }

  get countryCode(): string | null {
    return this._countryCode;
  }

  get note(): string | null {
    return this._note;
  }

  get description(): string | null {
    return this._description;
  }

  get pictureFullPath(): string | null {
    return this._pictureFullPath;
  }

  get timeZone(): string | null {
    return this._timeZone;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business Logic Methods

  /**
   * Check if user is active and can access the system
   */
  isActive(): boolean {
    return this._status === UserStatus.VISIBLE;
  }

  /**
   * Check if user is blocked
   */
  isBlocked(): boolean {
    return this._status === UserStatus.BLOCKED;
  }

  /**
   * Check if user is disabled
   */
  isDisabled(): boolean {
    return this._status === UserStatus.DISABLED;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this._type === UserType.ADMIN || this._type === UserType.SUPERADMIN;
  }

  /**
   * Check if user is super admin
   */
  isSuperAdmin(): boolean {
    return this._type === UserType.SUPERADMIN;
  }

  /**
   * Check if user is a customer
   */
  isCustomer(): boolean {
    return this._type === UserType.CUSTOMER;
  }

  /**
   * Block user
   */
  block(): void {
    if (this._status === UserStatus.BLOCKED) {
      throw new Error("User is already blocked");
    }
    this._status = UserStatus.BLOCKED;
    this.touch();
  }

  /**
   * Unblock user
   */
  unblock(): void {
    if (this._status !== UserStatus.BLOCKED) {
      throw new Error("User is not blocked");
    }
    this._status = UserStatus.VISIBLE;
    this.touch();
  }

  /**
   * Disable user
   */
  disable(): void {
    this._status = UserStatus.DISABLED;
    this.touch();
  }

  /**
   * Enable user
   */
  enable(): void {
    this._status = UserStatus.VISIBLE;
    this.touch();
  }

  /**
   * Update user profile
   */
  updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    countryCode?: string;
    birthday?: Date | null;
    timeZone?: string;
    description?: string;
    pictureFullPath?: string;
  }): void {
    if (data.firstName !== undefined) {
      if (!data.firstName || data.firstName.trim() === "") {
        throw new Error("First name cannot be empty");
      }
      this._firstName = data.firstName;
    }

    if (data.lastName !== undefined) {
      if (!data.lastName || data.lastName.trim() === "") {
        throw new Error("Last name cannot be empty");
      }
      this._lastName = data.lastName;
    }

    if (data.phone !== undefined) {
      this._phone = data.phone;
    }

    if (data.countryCode !== undefined) {
      this._countryCode = data.countryCode;
    }

    if (data.birthday !== undefined) {
      this._birthday = data.birthday;
    }

    if (data.timeZone !== undefined) {
      this._timeZone = data.timeZone;
    }

    if (data.description !== undefined) {
      this._description = data.description;
    }

    if (data.pictureFullPath !== undefined) {
      this._pictureFullPath = data.pictureFullPath;
    }

    this.touch();
  }

  /**
   * Update email
   */
  updateEmail(email: string): void {
    if (!email || !this.isValidEmail(email)) {
      throw new Error("Valid email is required");
    }
    this._email = email;
    this.touch();
  }

  /**
   * Add note to user
   */
  addNote(note: string): void {
    this._note = note;
    this.touch();
  }

  /**
   * Promote user to admin
   */
  promoteToAdmin(): void {
    if (this.isAdmin()) {
      throw new Error("User is already an admin");
    }
    this._type = UserType.ADMIN;
    this.touch();
  }

  /**
   * Promote user to super admin
   */
  promoteToSuperAdmin(): void {
    this._type = UserType.SUPERADMIN;
    this.touch();
  }

  /**
   * Demote user to customer
   */
  demoteToCustomer(): void {
    if (this.isCustomer()) {
      throw new Error("User is already a customer");
    }
    this._type = UserType.CUSTOMER;
    this.touch();
  }

  // Private helper methods

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  /**
   * Convert entity to plain object (for persistence)
   */
  toObject(): UserProps {
    return {
      id: this._id,
      email: this._email,
      firstName: this._firstName,
      lastName: this._lastName,
      status: this._status,
      type: this._type,
      birthday: this._birthday,
      phone: this._phone,
      countryCode: this._countryCode,
      note: this._note,
      description: this._description,
      pictureFullPath: this._pictureFullPath,
      timeZone: this._timeZone,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * Create User from plain object
   */
  static fromObject(props: UserProps): User {
    return new User(props);
  }
}
