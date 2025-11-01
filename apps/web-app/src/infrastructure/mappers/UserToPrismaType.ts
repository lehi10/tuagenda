/**
 * User to Prisma Type Adapter
 *
 * Converts Domain User entity to Prisma User type for backward compatibility.
 * This allows existing code that expects Prisma types to work with domain entities.
 *
 * @module infrastructure/mappers
 */

import { User as PrismaUser } from "@/lib/db/prisma";
import { User } from "@/core/domain/entities/User";

export class UserToPrismaType {
  /**
   * Convert Domain User entity to Prisma User type
   */
  static toPrismaType(user: User): PrismaUser {
    const userObj = user.toObject();

    return {
      id: userObj.id,
      email: userObj.email,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      status: userObj.status!,
      type: userObj.type!,
      birthday: userObj.birthday ?? null,
      phone: userObj.phone ?? null,
      countryCode: userObj.countryCode ?? null,
      note: userObj.note ?? null,
      description: userObj.description ?? null,
      pictureFullPath: userObj.pictureFullPath ?? null,
      timeZone: userObj.timeZone ?? null,
      createdAt: userObj.createdAt!,
      updatedAt: userObj.updatedAt!,
    };
  }
}
