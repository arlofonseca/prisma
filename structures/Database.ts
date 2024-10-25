import { characters, PrismaClient, users } from '@prisma/client';

export class Database {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  fetchAllUsers(): Promise<users[]> {
    return this.prisma.users.findMany();
  }

  fetchCharacterCount(): Promise<number> {
    return this.prisma.characters.count();
  }

  fetchCharacterByStateId(stateId: string): Promise<characters | null> {
    return this.prisma.characters.findUnique({ where: { stateId } });
  }

  updateCharacterName(stateId: string, firstName: string, lastName: string): Promise<characters | null> {
    return this.prisma.characters.update({
      where: { stateId },
      data: { firstName, lastName },
    });
  }

  async deleteInactiveCharacters(limit: number): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - limit);

    const result = await this.prisma.characters.deleteMany({
      where: {
        lastPlayed: {
          lt: date,
        },
      },
    });

    return result.count;
  }

  connect(): Promise<void> {
    return this.prisma.$connect();
  }

  disconnect(): Promise<void> {
    return this.prisma.$disconnect();
  }
}
