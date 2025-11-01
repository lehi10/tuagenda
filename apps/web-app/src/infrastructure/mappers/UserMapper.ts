/**
 * User Mapper
 *
 * Maps between Prisma User model and Domain User entity.
 * This keeps the domain independent from infrastructure concerns.
 *
 * @module infrastructure/mappers
 */

import { User as PrismaUser } from "@/lib/db/prisma";
import { User, UserStatus, UserType } from "@/core/domain/entities/User";

export class UserMapper {
  /**
   * Convert Prisma User model to Domain User entity
   */
  static toDomain(prismaUser: PrismaUser): User {
    return new User({
      id: prismaUser.id,
      email: prismaUser.email,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      status: prismaUser.status as UserStatus,
      type: prismaUser.type as UserType,
      birthday: prismaUser.birthday,
      phone: prismaUser.phone,
      countryCode: prismaUser.countryCode,
      note: prismaUser.note,
      description: prismaUser.description,
      pictureFullPath: prismaUser.pictureFullPath,
      timeZone: prismaUser.timeZone,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    });
  }

  /**
   * Convert Domain User entity to Prisma User creation data
   */
  static toPrismaCreate(user: User) {
    const userObj = user.toObject();
    return {
      id: userObj.id,
      email: userObj.email,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      status: userObj.status,
      type: userObj.type,
      birthday: userObj.birthday,
      phone: userObj.phone,
      countryCode: userObj.countryCode,
      note: userObj.note,
      description: userObj.description,
      pictureFullPath: userObj.pictureFullPath,
      timeZone: userObj.timeZone,
    };
  }

  /**
   * Convert Domain User entity to Prisma User update data
   */
  static toPrismaUpdate(user: User) {
    const userObj = user.toObject();
    return {
      email: userObj.email,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      status: userObj.status,
      type: userObj.type,
      birthday: userObj.birthday,
      phone: userObj.phone,
      countryCode: userObj.countryCode,
      note: userObj.note,
      description: userObj.description,
      pictureFullPath: userObj.pictureFullPath,
      timeZone: userObj.timeZone,
      updatedAt: new Date(),
    };
  }

  /**
   * Convert array of Prisma Users to array of Domain Users
   */
  static toDomainList(prismaUsers: PrismaUser[]): User[] {
    return prismaUsers.map((prismaUser) => this.toDomain(prismaUser));
  }
}
