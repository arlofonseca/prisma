import { PrismaClient, Prisma } from "@prisma/client";
import { TypedSql } from "@prisma/client/runtime/library";

class Client {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}

export class Database extends Client {
  constructor() {
    super();
  }

  private getModel<T extends keyof PrismaClient>(table: T) {
    return this.prisma[table] as any;
  }

  async update<T>(table: keyof PrismaClient, where: Prisma.Args<T, "update">["where"], data: Prisma.Args<T, "update">["data"]): Promise<T> {
    return this.getModel(table).update({ where, data });
  }

  async deleteMany<T>(table: keyof PrismaClient, where: Prisma.Args<T, "deleteMany">["where"]): Promise<number> {
    const result = await this.getModel(table).deleteMany({ where });
    return result.count;
  }

  async findUnique<T>(table: keyof PrismaClient, where: Prisma.Args<T, "findUnique">["where"]): Promise<T | null> {
    return this.getModel(table).findUnique({ where });
  }

  async findMany<T>(table: keyof PrismaClient, where: Prisma.Args<T, "findMany">["where"]): Promise<T[]> {
    return this.getModel(table).findMany({ where });
  }

  async queryRawTyped<T>(module: TypedSql<unknown[], T>): Promise<T[]> {
    return this.prisma.$queryRawTyped<T>(module);
  }

  connect(): Promise<void> {
    return this.prisma.$connect();
  }

  disconnect(): Promise<void> {
    return this.prisma.$disconnect();
  }
}
