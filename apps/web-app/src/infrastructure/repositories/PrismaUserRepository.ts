/**
 * Prisma User Repository (Adapter)
 *
 * This is an ADAPTER in hexagonal architecture.
 * It implements the IUserRepository port using Prisma as the persistence mechanism.
 * The domain layer depends on the interface, not this implementation.
 *
 * @module infrastructure/repositories
 */

import { prisma } from "@/lib/db/prisma";
import {
  IUserRepository,
  UserRepositoryFilters,
} from "@/core/domain/repositories/IUserRepository";
import { User } from "@/core/domain/entities/User";
import { UserMapper } from "../mappers/UserMapper";
import {
  Prisma,
  UserStatus as PrismaUserStatus,
  UserType as PrismaUserType,
} from "@prisma/client";

export class PrismaUserRepository implements IUserRepository {
  /**
   * Find a user by their ID (Firebase UID)
   */
  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  /**
   * Find a user by their email
   */
  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  /**
   * Find multiple users by their IDs
   */
  async findByIds(ids: string[]): Promise<User[]> {
    const prismaUsers = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return UserMapper.toDomainList(prismaUsers);
  }

  /**
   * Find all users with optional filtering
   */
  async findAll(filters?: UserRepositoryFilters): Promise<User[]> {
    const where: Prisma.UserWhereInput = {};

    if (filters) {
      // Status filter - Domain enums use same string values as Prisma
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          where.status = {
            in: filters.status as unknown as PrismaUserStatus[],
          };
        } else {
          where.status = filters.status as unknown as PrismaUserStatus;
        }
      }

      // Type filter - Domain enums use same string values as Prisma
      if (filters.type) {
        if (Array.isArray(filters.type)) {
          where.type = {
            in: filters.type as unknown as PrismaUserType[],
          };
        } else {
          where.type = filters.type as unknown as PrismaUserType;
        }
      }

      // Search filter (searches in firstName, lastName, email)
      if (filters.search) {
        where.OR = [
          { firstName: { contains: filters.search, mode: "insensitive" } },
          { lastName: { contains: filters.search, mode: "insensitive" } },
          { email: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      // Date range filters
      if (filters.createdAfter || filters.createdBefore) {
        where.createdAt = {};
        if (filters.createdAfter) {
          where.createdAt.gte = filters.createdAfter;
        }
        if (filters.createdBefore) {
          where.createdAt.lte = filters.createdBefore;
        }
      }
    }

    const prismaUsers = await prisma.user.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
      orderBy: { createdAt: "desc" },
    });

    return UserMapper.toDomainList(prismaUsers);
  }

  /**
   * Create a new user
   */
  async create(user: User): Promise<User> {
    const data = UserMapper.toPrismaCreate(user);

    const createdUser = await prisma.user.create({
      data,
    });

    return UserMapper.toDomain(createdUser);
  }

  /**
   * Update an existing user
   */
  async update(user: User): Promise<User> {
    const data = UserMapper.toPrismaUpdate(user);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    return UserMapper.toDomain(updatedUser);
  }

  /**
   * Delete a user by ID
   */
  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Check if a user exists by ID
   */
  async exists(id: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { id },
    });

    return count > 0;
  }

  /**
   * Check if an email is already taken
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });

    return count > 0;
  }

  /**
   * Count total users with optional filters
   */
  async count(filters?: UserRepositoryFilters): Promise<number> {
    const where: Prisma.UserWhereInput = {};

    if (filters) {
      // Status filter - Domain enums use same string values as Prisma
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          where.status = {
            in: filters.status as unknown as PrismaUserStatus[],
          };
        } else {
          where.status = filters.status as unknown as PrismaUserStatus;
        }
      }

      // Type filter - Domain enums use same string values as Prisma
      if (filters.type) {
        if (Array.isArray(filters.type)) {
          where.type = {
            in: filters.type as unknown as PrismaUserType[],
          };
        } else {
          where.type = filters.type as unknown as PrismaUserType;
        }
      }

      if (filters.search) {
        where.OR = [
          { firstName: { contains: filters.search, mode: "insensitive" } },
          { lastName: { contains: filters.search, mode: "insensitive" } },
          { email: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      if (filters.createdAfter || filters.createdBefore) {
        where.createdAt = {};
        if (filters.createdAfter) {
          where.createdAt.gte = filters.createdAfter;
        }
        if (filters.createdBefore) {
          where.createdAt.lte = filters.createdBefore;
        }
      }
    }

    return await prisma.user.count({ where });
  }
}
