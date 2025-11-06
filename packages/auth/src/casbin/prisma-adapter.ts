/**
 * Prisma Adapter for Casbin
 *
 * This adapter allows Casbin to use Prisma as the storage backend for policies.
 * Based on the official node-casbin adapter pattern.
 */

import { Adapter, Model, Helper } from "casbin";
import { PrismaClient } from "db";

interface CasbinRule {
  id: number;
  ptype: string;
  v0: string | null;
  v1: string | null;
  v2: string | null;
  v3: string | null;
  v4: string | null;
  v5: string | null;
}

export class PrismaAdapter implements Adapter {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Load all policy rules from database
   */
  async loadPolicy(model: Model): Promise<void> {
    const lines = await this.prisma.casbinRule.findMany();

    for (const line of lines) {
      this.loadPolicyLine(line, model);
    }
  }

  /**
   * Load a single policy line into the model
   */
  private loadPolicyLine(line: CasbinRule, model: Model): void {
    const result =
      line.ptype +
      ", " +
      [line.v0, line.v1, line.v2, line.v3, line.v4, line.v5]
        .filter((v) => v !== null && v !== "")
        .join(", ");

    Helper.loadPolicyLine(result, model);
  }

  /**
   * Save all policy rules to database
   */
  async savePolicy(model: Model): Promise<boolean> {
    // Delete all existing rules
    await this.prisma.casbinRule.deleteMany();

    // Get all policy rules from model
    const lines: CasbinRule[] = [];
    const policyRuleAST = model.model.get("p");
    const groupingPolicyAST = model.model.get("g");

    // Add policy rules (p, p2, p3, etc.)
    if (policyRuleAST) {
      for (const [ptype, ast] of policyRuleAST) {
        for (const rule of ast.policy) {
          lines.push(this.savePolicyLine(ptype, rule));
        }
      }
    }

    // Add grouping policy rules (g, g2, g3, etc.)
    if (groupingPolicyAST) {
      for (const [ptype, ast] of groupingPolicyAST) {
        for (const rule of ast.policy) {
          lines.push(this.savePolicyLine(ptype, rule));
        }
      }
    }

    // Insert all rules
    if (lines.length > 0) {
      await this.prisma.casbinRule.createMany({
        data: lines.map(({ id, ...rule }) => rule),
      });
    }

    return true;
  }

  /**
   * Convert a policy rule to database format
   */
  private savePolicyLine(ptype: string, rule: string[]): CasbinRule {
    const line: CasbinRule = {
      id: 0,
      ptype,
      v0: rule[0] ?? null,
      v1: rule[1] ?? null,
      v2: rule[2] ?? null,
      v3: rule[3] ?? null,
      v4: rule[4] ?? null,
      v5: rule[5] ?? null,
    };

    return line;
  }

  /**
   * Add a policy rule to database
   */
  async addPolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    const line = this.savePolicyLine(ptype, rule);
    await this.prisma.casbinRule.create({
      data: {
        ptype: line.ptype,
        v0: line.v0,
        v1: line.v1,
        v2: line.v2,
        v3: line.v3,
        v4: line.v4,
        v5: line.v5,
      },
    });
  }

  /**
   * Remove a policy rule from database
   */
  async removePolicy(
    sec: string,
    ptype: string,
    rule: string[],
  ): Promise<void> {
    const line = this.savePolicyLine(ptype, rule);
    await this.prisma.casbinRule.deleteMany({
      where: {
        ptype: line.ptype,
        v0: line.v0,
        v1: line.v1,
        v2: line.v2,
        v3: line.v3,
        v4: line.v4,
        v5: line.v5,
      },
    });
  }

  /**
   * Remove policies that match a filter
   */
  async removeFilteredPolicy(
    sec: string,
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void> {
    const where: any = { ptype };

    if (fieldIndex <= 0 && fieldValues.length > 0) {
      where.v0 = fieldValues[0 - fieldIndex];
    }
    if (fieldIndex <= 1 && fieldValues.length > 1 - fieldIndex) {
      where.v1 = fieldValues[1 - fieldIndex];
    }
    if (fieldIndex <= 2 && fieldValues.length > 2 - fieldIndex) {
      where.v2 = fieldValues[2 - fieldIndex];
    }
    if (fieldIndex <= 3 && fieldValues.length > 3 - fieldIndex) {
      where.v3 = fieldValues[3 - fieldIndex];
    }
    if (fieldIndex <= 4 && fieldValues.length > 4 - fieldIndex) {
      where.v4 = fieldValues[4 - fieldIndex];
    }
    if (fieldIndex <= 5 && fieldValues.length > 5 - fieldIndex) {
      where.v5 = fieldValues[5 - fieldIndex];
    }

    await this.prisma.casbinRule.deleteMany({ where });
  }
}
