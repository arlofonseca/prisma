import { characters, PrismaClient, users } from '@prisma/client';

export class Database {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  getManyUsers(): Promise<users[]> {
    return this.prisma.users.findMany();
  }

  getCharacterCount(): Promise<number> {
    return this.prisma.characters.count();
  }

  getCharacterByStateId(stateId: string): Promise<characters | null> {
    return this.prisma.characters.findUnique({ where: { stateId } });
  }

  updateCharacterName(
    stateId: string,
    firstName: string,
    lastName: string,
  ): Promise<characters | null> {
    return this.prisma.characters.update({
      where: { stateId },
      data: { firstName, lastName },
    });
  }

  async getCharacterByFirstName(firstName: string): Promise<characters[]> {
    return this.prisma.characters.findMany({
      where: {
        firstName: {
          contains: firstName.toLowerCase(),
        },
      },
    });
  }

  async getCharactersByGender(): Promise<Array<{ gender: string; count: number }>> {
    const result = await this.prisma.characters.groupBy({
      by: ['gender'],
      _count: {
        _all: true,
      },
    });

    return result.map((group: { gender: string; _count: { _all: number } }) => ({
      gender: group.gender,
      count: group._count._all,
    }));
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

  async rawQuery<T>(module: string): Promise<T> {
    return this.prisma.$queryRawTyped(module);
  }

  connect(): Promise<void> {
    return this.prisma.$connect();
  }

  disconnect(): Promise<void> {
    return this.prisma.$disconnect();
  }
}
