import { addCommand } from '@overextended/ox_lib/server';
import { characters, PrismaClient, users } from '@prisma/client';

const prisma = new PrismaClient();

addCommand(['fetchusers'], async (source: number): Promise<void> => {
  try {
    const data: users[] = await prisma.users.findMany();
    exports.chat.addMessage(source, '^#5e81ac--------- ^#ffffffUser Data ^#5e81ac---------');
    for (const user of data) {
      const message = `User ID: ^#5e81ac${user.userId} ^#ffffff| Username: ^#5e81ac${user.username ?? 'N/A'} ^#ffffff| License2: ^#5e81ac${user.license2} ^#ffffff| Steam: ^#5e81ac${user.steam ?? 'N/A'} ^#ffffff| FiveM: ^#5e81ac${user.fivem ?? 'N/A'} ^#ffffff| Discord: ^#5e81ac${user.discord ?? 'N/A'} `;
      exports.chat.addMessage(source, message);
    }
  } catch (error) {
    console.error('/fetchusers:', error);
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffAn error occurred while trying to fetch all user data.');
  }
}, {
  restricted: 'group.admin',
});

addCommand(['viewchar'], async (source: number, args: { stateId: string }): Promise<void> => {
  const stateId: string = args.stateId;

  try {
    const character = await prisma.characters.findUnique({
      where: { stateId },
      select: {
        firstName: true,
        lastName: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        lastPlayed: true,
        health: true,
        armour: true,
        statuses: true,
      },
    });

    if (!character) {
      exports.chat.addMessage(source, `^#d73232ERROR ^#ffffffCharacter with ID ${stateId} does not exist.`);
      return;
    }

    const name: string = character.lastName ? `${character.firstName} ${character.lastName}` : character.firstName;
    exports.chat.addMessage(source, `^#5e81ac[Character Details] ^#ffffffName: ^#5e81ac${name} ^#ffffff| Gender: ^#5e81ac${character.gender} ^#ffffff| Date of Birth: ^#5e81ac${character.dateOfBirth.toISOString().split('T')[0]} ^#ffffff| Phone Number: ^#5e81ac${character.phoneNumber || 'N/A'} ^#ffffff| Health: ^#5e81ac${character.health !== null ? character.health : 'N/A'} ^#ffffff| Armour: ^#5e81ac${character.armour !== null ? character.armour : 'N/A'} ^#ffffff| Statuses: ^#5e81ac${character.statuses || 'N/A'}`);
  } catch (error) {
    console.error('/viewchar:', error);
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffAn error occurred while trying to view character.');
  }
}, {
  params: [
    {
      name: 'stateId',
      paramType: 'string',
      optional: false,
    },
  ],
  restricted: 'group.admin',
});

addCommand(['updatechar'], async (source: number, args: { stateId: string, firstName: string, lastName: string }): Promise<void> => {
  const stateId: string = args.stateId;
  const firstName: string = args.firstName;
  const lastName: string = args.lastName;

  try {
    const character: characters | null = await prisma.characters.findUnique({
      where: { stateId },
    });

    if (!character) {
      exports.chat.addMessage(source, `^#d73232ERROR ^#ffffffCharacter with ID ${stateId} does not exist.`);
      return;
    }

    await prisma.characters.update({
      where: { stateId },
      data: {
        firstName,
        lastName,
      },
    });

    exports.chat.addMessage(source, `^#5e81ac[ADMIN] ^#ffffffCharacter's name has been updated to: ^#5e81ac${firstName} ${lastName}`);
  } catch (error) {
    console.error('/updatechar:', error);
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffAn error occurred while trying to update the character\'s name.');
  }
}, {
  params: [
    {
      name: 'stateId',
      paramType: 'string',
      optional: false,
    },
    {
      name: 'firstName',
      paramType: 'string',
      optional: false,
    },
    {
      name: 'lastName',
      paramType: 'string',
      optional: false,
    },
  ],
  restricted: 'group.admin',
});
