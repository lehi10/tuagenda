export interface EmployeeExceptionProps {
  id: string;
  businessUserId: string;
  businessId: string;
  date: Date;
  isAllDay: boolean;
  startTime?: Date;
  endTime?: Date;
  isAvailable: boolean; // false = blocked, true = exceptionally available
  reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EmployeeException {
  private readonly _id: string;
  private readonly _businessUserId: string;
  private readonly _businessId: string;
  private _date: Date;
  private _isAllDay: boolean;
  private _startTime?: Date;
  private _endTime?: Date;
  private _isAvailable: boolean;
  private _reason?: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  private constructor(props: EmployeeExceptionProps) {
    this._id = props.id;
    this._businessUserId = props.businessUserId;
    this._businessId = props.businessId;
    this._date = props.date;
    this._isAllDay = props.isAllDay;
    this._startTime = props.startTime;
    this._endTime = props.endTime;
    this._isAvailable = props.isAvailable;
    this._reason = props.reason;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  private validate(): void {
    if (!this._id) {
      throw new Error("EmployeeException ID is required");
    }

    if (!this._businessUserId) {
      throw new Error("BusinessUser ID is required");
    }

    if (!this._businessId) {
      throw new Error("Business ID is required");
    }

    if (!this._date) {
      throw new Error("Date is required");
    }

    // If not all day, start and end times are required
    if (!this._isAllDay) {
      if (!this._startTime || !this._endTime) {
        throw new Error(
          "Start time and end time are required when exception is not all day"
        );
      }

      if (this._startTime >= this._endTime) {
        throw new Error("Start time must be before end time");
      }
    }
  }

  // Factory method
  static create(props: EmployeeExceptionProps): EmployeeException {
    return new EmployeeException(props);
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

  get date(): Date {
    return this._date;
  }

  get isAllDay(): boolean {
    return this._isAllDay;
  }

  get startTime(): Date | undefined {
    return this._startTime;
  }

  get endTime(): Date | undefined {
    return this._endTime;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  get reason(): string | undefined {
    return this._reason;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  // Business methods
  updateDate(date: Date): void {
    if (!date) {
      throw new Error("Date is required");
    }
    this._date = date;
  }

  updateTime(startTime: Date, endTime: Date): void {
    if (startTime >= endTime) {
      throw new Error("Start time must be before end time");
    }
    this._startTime = startTime;
    this._endTime = endTime;
    this._isAllDay = false;
  }

  makeAllDay(): void {
    this._isAllDay = true;
    this._startTime = undefined;
    this._endTime = undefined;
  }

  updateAvailability(isAvailable: boolean): void {
    this._isAvailable = isAvailable;
  }

  updateReason(reason: string | undefined): void {
    this._reason = reason;
  }

  // Serialization
  toObject(): EmployeeExceptionProps {
    return {
      id: this._id,
      businessUserId: this._businessUserId,
      businessId: this._businessId,
      date: this._date,
      isAllDay: this._isAllDay,
      startTime: this._startTime,
      endTime: this._endTime,
      isAvailable: this._isAvailable,
      reason: this._reason,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static fromObject(props: EmployeeExceptionProps): EmployeeException {
    return EmployeeException.create(props);
  }
}
