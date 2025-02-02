import { characters, PrismaClient } from "@prisma/client";
import { TypedSql } from "@prisma/client/runtime/library";

class Database {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  updateCharacterName(charId: number, firstName: string, lastName: string ): Promise<characters | null> {
    return this.prisma.characters.update({ where: { charId }, data: { firstName, lastName } });
  }

  async getCharacterByFirstName(firstName: string): Promise<characters[]> {
    return this.prisma.characters.findMany({ where: { firstName: { contains: firstName.toLowerCase() } } });
  }

  async deleteInactiveCharacters(limit: number): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - limit);

    const result = await this.prisma.characters.deleteMany({ where: { lastPlayed: { lt: date } } });

    return result.count;
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

const db: Database = new Database();

export default db;
