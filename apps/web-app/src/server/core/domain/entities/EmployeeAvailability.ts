export interface EmployeeAvailabilityProps {
  id: string;
  businessUserId: string;
  businessId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startTime: Date;
  endTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EmployeeAvailability {
  private readonly _id: string;
  private readonly _businessUserId: string;
  private readonly _businessId: string;
  private _dayOfWeek: number;
  private _startTime: Date;
  private _endTime: Date;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(props: EmployeeAvailabilityProps) {
    this._id = props.id;
    this._businessUserId = props.businessUserId;
    this._businessId = props.businessId;
    this._dayOfWeek = props.dayOfWeek;
    this._startTime = props.startTime;
    this._endTime = props.endTime;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this._id) {
      throw new Error("EmployeeAvailability ID is required");
    }

    if (!this._businessUserId) {
      throw new Error("BusinessUser ID is required");
    }

    if (!this._businessId) {
      throw new Error("Business ID is required");
    }

    if (this._dayOfWeek < 0 || this._dayOfWeek > 6) {
      throw new Error(
        "Day of week must be between 0 (Sunday) and 6 (Saturday)"
      );
    }

    if (!this._startTime || !this._endTime) {
      throw new Error("Start time and end time are required");
    }

    if (this._startTime >= this._endTime) {
      throw new Error("Start time must be before end time");
    }
  }

  // Factory method
  static create(props: EmployeeAvailabilityProps): EmployeeAvailability {
    return new EmployeeAvailability(props);
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get businessUserId(): string {
    return this._businessUserId;
  }

  get businessId(): string {
    return this._businessId;
  }

  get dayOfWeek(): number {
    return this._dayOfWeek;
  }

  get startTime(): Date {
    return this._startTime;
  }

  get endTime(): Date {
    return this._endTime;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // Business methods
  updateTime(startTime: Date, endTime: Date): void {
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }
    this._startTime = startTime;
    this._endTime = endTime;
  }

  updateDayOfWeek(dayOfWeek: number): void {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new Error(
        "Day of week must be between 0 (Sunday) and 6 (Saturday)"
      );
    }
    this._dayOfWeek = dayOfWeek;
  }

  // Serialization
  toObject(): EmployeeAvailabilityProps {
    return {
      id: this._id,
      businessUserId: this._businessUserId,
      businessId: this._businessId,
      dayOfWeek: this._dayOfWeek,
      startTime: this._startTime,
      endTime: this._endTime,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromObject(props: EmployeeAvailabilityProps): EmployeeAvailability {
    return EmployeeAvailability.create(props);
  }
}
