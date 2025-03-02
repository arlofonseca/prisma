import { characters, PrismaClient } from "@prisma/client";
import { TypedSql } from "@prisma/client/runtime/library";

export class Database {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async updateCharacterName(charId: number, firstName: string, lastName: string): Promise<characters | null> {
    return this.prisma.characters.update({ where: { charId }, data: { firstName, lastName } });
  }

  async deleteInactiveCharacters(limit: number): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - limit);

    const result = await this.prisma.characters.deleteMany({ where: { lastPlayed: { lt: date } } });

    return result.count;
  }

  async getCharacterByStateId(stateId: string): Promise<characters | null> {
    return this.prisma.characters.findUnique({ where: { stateId } });
  }

  async getCharacterByFirstName(firstName: string): Promise<characters[]> {
    return this.prisma.characters.findMany({ where: { firstName: { contains: firstName.toLowerCase() } } });
  }

  async rawQuery<T>(module: TypedSql<unknown[], T>) {
    return this.prisma.$queryRawTyped<T>(module as any);
  }

  connect(): Promise<void> {
    return this.prisma.$connect();
  }

  disconnect(): Promise<void> {
    return this.prisma.$disconnect();
  }
}