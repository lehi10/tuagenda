import { cn } from "../utils";

describe("cn utility function", () => {
  it("combines simple classes correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "conditional", false && "excluded")).toBe(
      "base conditional"
    );
  });

  it("merges conflicting Tailwind classes", () => {
    // twMerge should keep only the last padding class
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });

  it("handles class objects", () => {
    const result = cn({
      active: true,
      disabled: false,
      primary: true,
    });
    expect(result).toContain("active");
    expect(result).toContain("primary");
    expect(result).not.toContain("disabled");
  });

  it("handles class arrays", () => {
    expect(cn(["class1", "class2", "class3"])).toBe("class1 class2 class3");
  });

  it("handles undefined and null", () => {
    expect(cn("class1", undefined, null, "class2")).toBe("class1 class2");
  });

  it("combines multiple input types", () => {
    const result = cn(
      "base",
      ["array-class"],
      { "object-class": true },
      undefined,
      "string-class"
    );
    expect(result).toContain("base");
    expect(result).toContain("array-class");
    expect(result).toContain("object-class");
    expect(result).toContain("string-class");
  });

  it("resolves Tailwind CSS conflicts correctly", () => {
    // The last value should win in conflicts
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("bg-gray-100", "bg-white")).toBe("bg-white");
  });
});
