import { addCommand } from '@overextended/ox_lib/server';
import { PrismaClient, users } from "@prisma/client";

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
    console.error("/fetchusers:", error);
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffAn error occurred while trying to fetch all user data.');
  }
}, {
  restricted: 'group.admin',
});

addCommand(['viewchar'], async (source: number, args: { charId: number }): Promise<void> => {
  const charId: number = args.charId;
  if (isNaN(charId)) {
    exports.chat.addMessage(source, `^#d73232ERROR ^#ffffffInvalid character ID.`);
    return;
  }

  try {
    const character = await prisma.characters.findUnique({
      where: { charId },
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
      exports.chat.addMessage(source, `^#d73232ERROR ^#ffffffCharacter with ID ${charId} does not exist.`);
      return;
    }

    const name: string = character.lastName ? `${character.firstName} ${character.lastName}` : character.firstName;
    exports.chat.addMessage(source, `^#5e81ac[Character Details] ^#ffffffName: ^#5e81ac${name} ^#ffffff| Gender: ^#5e81ac${character.gender} ^#ffffff| Date of Birth: ^#5e81ac${character.dateOfBirth.toISOString().split('T')[0]} ^#ffffff| Phone Number: ^#5e81ac${character.phoneNumber || 'N/A'} ^#ffffff| Health: ^#5e81ac${character.health !== null ? character.health : 'N/A'} ^#ffffff| Armour: ^#5e81ac${character.armour !== null ? character.armour : 'N/A'} ^#ffffff| Statuses: ^#5e81ac${character.statuses || 'N/A'}`);
  } catch (error) {
    console.error("/viewchar:", error);
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffAn error occurred while trying to view character.');
  }
}, {
  params: [
    {
      name: 'charId',
      paramType: 'number',
      optional: false,
    },
  ],
  restricted: 'group.admin',
});
