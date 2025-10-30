import { createUserSchema, createUserFromAuthSchema } from "../user.schema";

describe("User Validation Schemas", () => {
  describe("createUserSchema", () => {
    const validUserData = {
      id: "firebase-uid-123",
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    it("validates complete user data correctly", () => {
      const result = createUserSchema.safeParse(validUserData);
      expect(result.success).toBe(true);
    });

    it("validates with optional fields", () => {
      const userData = {
        ...validUserData,
        phone: "+1234567890",
        birthday: new Date("1990-01-01"),
        note: "Some note",
        description: "User description",
        pictureFullPath: "https://example.com/picture.jpg",
        timeZone: "America/New_York",
        status: "visible" as const,
        type: "customer" as const,
      };

      const result = createUserSchema.safeParse(userData);
      expect(result.success).toBe(true);
    });

    it("fails when email is invalid", () => {
      const invalidData = {
        ...validUserData,
        email: "invalid-email",
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Invalid email format"
        );
      }
    });

    it("fails when ID is empty", () => {
      const invalidData = {
        ...validUserData,
        id: "",
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("User ID is required");
      }
    });

    it("fails when firstName is empty", () => {
      const invalidData = {
        ...validUserData,
        firstName: "",
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "First name is required"
        );
      }
    });

    it("fails when lastName is empty", () => {
      const invalidData = {
        ...validUserData,
        lastName: "",
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Last name is required"
        );
      }
    });

    it("accepts null values for optional fields", () => {
      const userData = {
        ...validUserData,
        phone: null,
        birthday: null,
        note: null,
        description: null,
        pictureFullPath: null,
        timeZone: null,
      };

      const result = createUserSchema.safeParse(userData);
      expect(result.success).toBe(true);
    });

    it("validates status enums correctly", () => {
      const statuses = ["hidden", "visible", "disabled", "blocked"];

      statuses.forEach((status) => {
        const result = createUserSchema.safeParse({
          ...validUserData,
          status,
        });
        expect(result.success).toBe(true);
      });
    });

    it("fails with invalid status", () => {
      const invalidData = {
        ...validUserData,
        status: "invalid-status",
      };

      const result = createUserSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("validates type enums correctly", () => {
      const types = ["customer", "provider", "manager", "admin"];

      types.forEach((type) => {
        const result = createUserSchema.safeParse({
          ...validUserData,
          type,
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("createUserFromAuthSchema", () => {
    const validAuthData = {
      id: "firebase-uid-123",
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
    };

    it("validates minimal authentication data correctly", () => {
      const result = createUserFromAuthSchema.safeParse(validAuthData);
      expect(result.success).toBe(true);
    });

    it("validates with pictureFullPath as URL", () => {
      const userData = {
        ...validAuthData,
        pictureFullPath: "https://example.com/avatar.jpg",
      };

      const result = createUserFromAuthSchema.safeParse(userData);
      expect(result.success).toBe(true);
    });

    it("accepts pictureFullPath as null", () => {
      const userData = {
        ...validAuthData,
        pictureFullPath: null,
      };

      const result = createUserFromAuthSchema.safeParse(userData);
      expect(result.success).toBe(true);
    });

    it("fails when pictureFullPath is not a valid URL", () => {
      const invalidData = {
        ...validAuthData,
        pictureFullPath: "not-a-url",
      };

      const result = createUserFromAuthSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("requires all mandatory fields", () => {
      const missingFields = [
        { ...validAuthData, id: undefined },
        { ...validAuthData, email: undefined },
        { ...validAuthData, firstName: undefined },
        { ...validAuthData, lastName: undefined },
      ];

      missingFields.forEach((data) => {
        const result = createUserFromAuthSchema.safeParse(data);
        expect(result.success).toBe(false);
      });
    });
  });
});
