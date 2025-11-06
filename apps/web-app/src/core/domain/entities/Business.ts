/**
 * Business Domain Entity
 *
 * This is the core domain entity representing a Business in the system.
 * It contains business logic and is independent of any infrastructure concerns.
 *
 * @module core/domain/entities
 */

export enum BusinessStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
}

export interface BusinessProps {
  id?: number;
  title: string;
  slug: string;
  domain?: string | null;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  timeZone: string;
  locale: string;
  currency: string;
  status?: BusinessStatus;
  email: string;
  phone: string;
  website?: string | null;
  address: string;
  city: string;
  state?: string | null;
  country: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Business Entity
 *
 * Represents a business in the TuAgenda system.
 * Contains business rules and validations.
 */
export class Business {
  private _id?: number;
  private _title: string;
  private _slug: string;
  private _domain: string | null;
  private _description: string | null;
  private _logo: string | null;
  private _coverImage: string | null;
  private _timeZone: string;
  private _locale: string;
  private _currency: string;
  private _status: BusinessStatus;
  private _email: string;
  private _phone: string;
  private _website: string | null;
  private _address: string;
  private _city: string;
  private _state: string | null;
  private _country: string;
  private _postalCode: string | null;
  private _latitude: number | null;
  private _longitude: number | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: BusinessProps) {
    // Validations
    if (!props.title || props.title.trim() === "") {
      throw new Error("Business title is required");
    }
    if (!props.slug || props.slug.trim() === "") {
      throw new Error("Business slug is required");
    }
    if (!props.email || !this.isValidEmail(props.email)) {
      throw new Error("Valid email is required");
    }
    if (!props.phone || props.phone.trim() === "") {
      throw new Error("Phone is required");
    }
    if (!props.address || props.address.trim() === "") {
      throw new Error("Address is required");
    }
    if (!props.city || props.city.trim() === "") {
      throw new Error("City is required");
    }
    if (!props.country || props.country.trim() === "") {
      throw new Error("Country is required");
    }
    if (!props.timeZone || props.timeZone.trim() === "") {
      throw new Error("TimeZone is required");
    }
    if (!props.locale || props.locale.trim() === "") {
      throw new Error("Locale is required");
    }
    if (!props.currency || props.currency.trim() === "") {
      throw new Error("Currency is required");
    }

    this._id = props.id;
    this._title = props.title;
    this._slug = props.slug;
    this._domain = props.domain || null;
    this._description = props.description || null;
    this._logo = props.logo || null;
    this._coverImage = props.coverImage || null;
    this._timeZone = props.timeZone;
    this._locale = props.locale;
    this._currency = props.currency;
    this._status = props.status || BusinessStatus.ACTIVE;
    this._email = props.email;
    this._phone = props.phone;
    this._website = props.website || null;
    this._address = props.address;
    this._city = props.city;
    this._state = props.state || null;
    this._country = props.country;
    this._postalCode = props.postalCode || null;
    this._latitude = props.latitude || null;
    this._longitude = props.longitude || null;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  // Getters
  get id(): number | undefined {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get slug(): string {
    return this._slug;
  }

  get domain(): string | null {
    return this._domain;
  }

  get description(): string | null {
    return this._description;
  }

  get logo(): string | null {
    return this._logo;
  }

  get coverImage(): string | null {
    return this._coverImage;
  }

  get timeZone(): string {
    return this._timeZone;
  }

  get locale(): string {
    return this._locale;
  }

  get currency(): string {
    return this._currency;
  }

  get status(): BusinessStatus {
    return this._status;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string {
    return this._phone;
  }

  get website(): string | null {
    return this._website;
  }

  get address(): string {
    return this._address;
  }

  get city(): string {
    return this._city;
  }

  get state(): string | null {
    return this._state;
  }

  get country(): string {
    return this._country;
  }

  get postalCode(): string | null {
    return this._postalCode;
  }

  get latitude(): number | null {
    return this._latitude;
  }

  get longitude(): number | null {
    return this._longitude;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business Logic Methods

  /**
   * Check if business is active
   */
  isActive(): boolean {
    return this._status === BusinessStatus.ACTIVE;
  }

  /**
   * Check if business is inactive
   */
  isInactive(): boolean {
    return this._status === BusinessStatus.INACTIVE;
  }

  /**
   * Check if business is suspended
   */
  isSuspended(): boolean {
    return this._status === BusinessStatus.SUSPENDED;
  }

  /**
   * Activate business
   */
  activate(): void {
    this._status = BusinessStatus.ACTIVE;
    this.touch();
  }

  /**
   * Deactivate business
   */
  deactivate(): void {
    this._status = BusinessStatus.INACTIVE;
    this.touch();
  }

  /**
   * Suspend business
   */
  suspend(): void {
    this._status = BusinessStatus.SUSPENDED;
    this.touch();
  }

  /**
   * Update business information
   */
  updateInfo(data: {
    title?: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    timeZone?: string;
    locale?: string;
    currency?: string;
  }): void {
    if (data.title !== undefined) {
      if (!data.title || data.title.trim() === "") {
        throw new Error("Title cannot be empty");
      }
      this._title = data.title;
    }

    if (data.description !== undefined) {
      this._description = data.description;
    }

    if (data.email !== undefined) {
      if (!data.email || !this.isValidEmail(data.email)) {
        throw new Error("Valid email is required");
      }
      this._email = data.email;
    }

    if (data.phone !== undefined) {
      if (!data.phone || data.phone.trim() === "") {
        throw new Error("Phone cannot be empty");
      }
      this._phone = data.phone;
    }

    if (data.website !== undefined) {
      this._website = data.website;
    }

    if (data.address !== undefined) {
      if (!data.address || data.address.trim() === "") {
        throw new Error("Address cannot be empty");
      }
      this._address = data.address;
    }

    if (data.city !== undefined) {
      if (!data.city || data.city.trim() === "") {
        throw new Error("City cannot be empty");
      }
      this._city = data.city;
    }

    if (data.state !== undefined) {
      this._state = data.state;
    }

    if (data.country !== undefined) {
      if (!data.country || data.country.trim() === "") {
        throw new Error("Country cannot be empty");
      }
      this._country = data.country;
    }

    if (data.postalCode !== undefined) {
      this._postalCode = data.postalCode;
    }

    if (data.timeZone !== undefined) {
      this._timeZone = data.timeZone;
    }

    if (data.locale !== undefined) {
      this._locale = data.locale;
    }

    if (data.currency !== undefined) {
      this._currency = data.currency;
    }

    this.touch();
  }

  /**
   * Update branding (logo, coverImage, domain)
   */
  updateBranding(data: {
    logo?: string;
    coverImage?: string;
    domain?: string;
  }): void {
    if (data.logo !== undefined) {
      this._logo = data.logo;
    }

    if (data.coverImage !== undefined) {
      this._coverImage = data.coverImage;
    }

    if (data.domain !== undefined) {
      this._domain = data.domain;
    }

    this.touch();
  }

  /**
   * Update location coordinates
   */
  updateLocation(latitude: number, longitude: number): void {
    this._latitude = latitude;
    this._longitude = longitude;
    this.touch();
  }

  /**
   * Check if business has location coordinates
   */
  hasLocation(): boolean {
    return this._latitude !== null && this._longitude !== null;
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
  toObject(): BusinessProps {
    return {
      id: this._id,
      title: this._title,
      slug: this._slug,
      domain: this._domain,
      description: this._description,
      logo: this._logo,
      coverImage: this._coverImage,
      timeZone: this._timeZone,
      locale: this._locale,
      currency: this._currency,
      status: this._status,
      email: this._email,
      phone: this._phone,
      website: this._website,
      address: this._address,
      city: this._city,
      state: this._state,
      country: this._country,
      postalCode: this._postalCode,
      latitude: this._latitude,
      longitude: this._longitude,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  /**
   * Create Business from plain object
   */
  static fromObject(props: BusinessProps): Business {
    return new Business(props);
  }
}
