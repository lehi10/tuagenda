import {
  formatInTz,
  startOfDayInTz,
  endOfDayInTz,
  slotToUtcDate,
  getBrowserTimezone,
  SUPPORTED_TIMEZONES,
} from "../timezone-utils";

describe("timezone-utils", () => {
  describe("formatInTz", () => {
    // 2026-04-20T15:00:00.000Z = 10:00 AM in Bogotá (UTC-5), 11:00 AM in Buenos Aires (UTC-3)
    const utcDate = new Date("2026-04-20T15:00:00.000Z");

    it("formats UTC date in Bogotá timezone correctly (UTC-5)", () => {
      expect(formatInTz(utcDate, "America/Bogota", "HH:mm")).toBe("10:00");
    });

    it("formats UTC date in Buenos Aires timezone correctly (UTC-3)", () => {
      expect(formatInTz(utcDate, "America/Argentina/Buenos_Aires", "HH:mm")).toBe("12:00");
    });

    it("formats UTC date in Madrid timezone correctly (UTC+2 in summer)", () => {
      expect(formatInTz(utcDate, "Europe/Madrid", "HH:mm")).toBe("17:00");
    });

    it("formats date string correctly", () => {
      expect(formatInTz(utcDate, "America/Bogota", "yyyy-MM-dd")).toBe("2026-04-20");
    });

    it("formats date crossing midnight correctly", () => {
      // 2026-04-20T03:00:00.000Z = 2026-04-19 22:00 in Bogotá (UTC-5)
      const midnight = new Date("2026-04-20T03:00:00.000Z");
      expect(formatInTz(midnight, "America/Bogota", "yyyy-MM-dd")).toBe("2026-04-19");
    });
  });

  describe("startOfDayInTz", () => {
    it("returns UTC equivalent of midnight in Bogotá (UTC-5)", () => {
      const date = new Date("2026-04-20T12:00:00.000Z");
      const result = startOfDayInTz(date, "America/Bogota");
      // Midnight in Bogotá = 05:00 UTC
      expect(result.toISOString()).toBe("2026-04-20T05:00:00.000Z");
    });

    it("returns UTC equivalent of midnight in Buenos Aires (UTC-3)", () => {
      const date = new Date("2026-04-20T12:00:00.000Z");
      const result = startOfDayInTz(date, "America/Argentina/Buenos_Aires");
      // Midnight in Buenos Aires = 03:00 UTC
      expect(result.toISOString()).toBe("2026-04-20T03:00:00.000Z");
    });

    it("returns UTC equivalent of midnight in Mexico City (UTC-6 standard)", () => {
      const date = new Date("2026-01-15T12:00:00.000Z");
      const result = startOfDayInTz(date, "America/Mexico_City");
      // Midnight in Mexico City (CST UTC-6 in January) = 06:00 UTC
      expect(result.toISOString()).toBe("2026-01-15T06:00:00.000Z");
    });
  });

  describe("endOfDayInTz", () => {
    it("returns UTC equivalent of 23:59:59.999 in Bogotá (UTC-5)", () => {
      const date = new Date("2026-04-20T12:00:00.000Z");
      const result = endOfDayInTz(date, "America/Bogota");
      // 23:59:59.999 in Bogotá = 04:59:59.999 UTC next day
      expect(result.toISOString()).toBe("2026-04-21T04:59:59.999Z");
    });

    it("start and end of day span exactly 24 hours", () => {
      const date = new Date("2026-04-20T12:00:00.000Z");
      const start = startOfDayInTz(date, "America/Bogota");
      const end = endOfDayInTz(date, "America/Bogota");
      expect(end.getTime() - start.getTime()).toBe(86399999);
    });
  });

  describe("slotToUtcDate", () => {
    // Use midday UTC so the base date stays on Apr 20 in all Latin American timezones
    const baseDate = new Date("2026-04-20T12:00:00.000Z");

    it("converts '09:00' in Bogotá (UTC-5) to correct UTC (14:00 UTC)", () => {
      const result = slotToUtcDate(baseDate, "09:00", "America/Bogota");
      expect(result.toISOString()).toBe("2026-04-20T14:00:00.000Z");
    });

    it("converts '09:00' in Buenos Aires (UTC-3) to correct UTC (12:00 UTC)", () => {
      const result = slotToUtcDate(baseDate, "09:00", "America/Argentina/Buenos_Aires");
      expect(result.toISOString()).toBe("2026-04-20T12:00:00.000Z");
    });

    it("converts '00:00' (midnight) correctly", () => {
      const result = slotToUtcDate(baseDate, "00:00", "America/Bogota");
      expect(result.toISOString()).toBe("2026-04-20T05:00:00.000Z");
    });

    it("converts '23:30' correctly", () => {
      const result = slotToUtcDate(baseDate, "23:30", "America/Bogota");
      expect(result.toISOString()).toBe("2026-04-21T04:30:00.000Z");
    });
  });

  describe("getBrowserTimezone", () => {
    it("returns a non-empty string", () => {
      const tz = getBrowserTimezone();
      expect(typeof tz).toBe("string");
      expect(tz.length).toBeGreaterThan(0);
    });

    it("returns a valid IANA timezone that can be used by Intl", () => {
      const tz = getBrowserTimezone();
      expect(() =>
        new Intl.DateTimeFormat("en", { timeZone: tz })
      ).not.toThrow();
    });
  });

  describe("SUPPORTED_TIMEZONES", () => {
    it("contains only Latin America and Spain timezones", () => {
      SUPPORTED_TIMEZONES.forEach((tz) => {
        const isLatAm = tz.value.startsWith("America/");
        const isSpain = tz.value === "Europe/Madrid";
        expect(isLatAm || isSpain).toBe(true);
      });
    });

    it("each entry has value and label fields", () => {
      SUPPORTED_TIMEZONES.forEach((tz) => {
        expect(typeof tz.value).toBe("string");
        expect(tz.value.length).toBeGreaterThan(0);
        expect(typeof tz.label).toBe("string");
        expect(tz.label.length).toBeGreaterThan(0);
      });
    });

    it("all IANA timezone values are valid", () => {
      SUPPORTED_TIMEZONES.forEach((tz) => {
        expect(() =>
          new Intl.DateTimeFormat("en", { timeZone: tz.value })
        ).not.toThrow();
      });
    });

    it("includes key Latin American timezones", () => {
      const values = SUPPORTED_TIMEZONES.map((tz) => tz.value);
      expect(values).toContain("America/Bogota");
      expect(values).toContain("America/Argentina/Buenos_Aires");
      expect(values).toContain("America/Mexico_City");
      expect(values).toContain("America/Sao_Paulo");
      expect(values).toContain("Europe/Madrid");
    });

    it("has no duplicate values", () => {
      const values = SUPPORTED_TIMEZONES.map((tz) => tz.value);
      const unique = new Set(values);
      expect(unique.size).toBe(values.length);
    });
  });
});
