# Entity Structure

Domain entities are classes with private fields, constructor validation, and business logic methods. They are independent of any ORM or infrastructure concern.

## Structure

```typescript
export enum EntityStatus { ACTIVE = "active", INACTIVE = "inactive" }

export interface EntityProps {
  id: string;
  status?: EntityStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MyEntity {
  private readonly _id: string;
  private _status: EntityStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: EntityProps) {
    if (!props.id) throw new Error("ID is required"); // validate in constructor
    this._id = props.id;
    this._status = props.status ?? EntityStatus.ACTIVE;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): string { return this._id; }

  someBusinessAction(): void {
    this._status = EntityStatus.INACTIVE;
    this.touch(); // always call touch() after mutations
  }

  private touch(): void { this._updatedAt = new Date(); }

  toObject(): EntityProps { return { id: this._id, status: this._status, createdAt: this._createdAt, updatedAt: this._updatedAt }; }
  static fromObject(props: EntityProps): MyEntity { return new MyEntity(props); }
}
```

## Rules

- Fields: private with `_` prefix, readonly if immutable (`_id`, `_createdAt`)
- Enums: defined in the same entity file
- Validation: in constructor, throw `Error` with descriptive message
- Mutations: through named business methods, always call `touch()` at the end
- Serialization: `toObject()` for persistence, `static fromObject()` for reconstruction
- Factory methods: `static createX()` for alternate construction patterns (e.g. `User.createGuest()`)

## Exception

Plain interfaces are allowed for simplified read shapes with no business logic:

```typescript
// OK — no behavior, just data
export interface UserSearchResult { id: string; email: string; firstName: string; }
```
