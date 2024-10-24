import * as Cfx from '@nativewrappers/fivem/server';
import { GetPlayer } from '@overextended/ox_core/server';
import { addCommand } from '@overextended/ox_lib/server';
import db from '../@types/DB';

addCommand(['fetchusers'], async (source: number): Promise<void> => {
  const player = GetPlayer(source);

  if (!player.charId) return;

  try {
    const data = await db.fetchAllUsers();
    exports.chat.addMessage(source, '^#5e81ac--------- ^#ffffffUser Data ^#5e81ac---------');
    for (const user of data) {
      exports.chat.addMessage(source, `User ID: ^#5e81ac${user.userId} ^#ffffff| Username: ^#5e81ac${user.username ?? 'N/A'} ^#ffffff| License2: ^#5e81ac${user.license2} ^#ffffff| Steam: ^#5e81ac${user.steam ?? 'N/A'} ^#ffffff| FiveM: ^#5e81ac${user.fivem ?? 'N/A'} ^#ffffff| Discord: ^#5e81ac${user.discord ?? 'N/A'}`);
    }
  } catch (error) {
    console.error('/fetchusers:', error);
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffAn error occurred while trying to fetch all user data.');
  }
},
  {
    restricted: 'group.admin',
  },
);

addCommand(['viewchar'], async (source: number, args: { stateId: string }): Promise<void> => {
  const player = GetPlayer(source);

  if (!player.charId) return;

  const stateId: string = args.stateId;

  try {
    const character = await db.fetchCharacterByStateId(stateId);
    if (!character) {
      exports.chat.addMessage(source, `^#d73232ERROR ^#ffffffCharacter with ID ${stateId} does not exist.`);
      return;
    }

    const name: string = character.lastName ? `${character.firstName} ${character.lastName}` : character.firstName;
    exports.chat.addMessage(source, `^#5e81ac[ADMIN] ^#ffffffName: ^#5e81ac${name} ^#ffffff| Gender: ^#5e81ac${character.gender} ^#ffffff| Date of Birth: ^#5e81ac${character.dateOfBirth.toISOString().split('T')[0]} ^#ffffff| Phone Number: ^#5e81ac${character.phoneNumber || 'N/A'} ^#ffffff| Health: ^#5e81ac${character.health !== null ? character.health : 'N/A'} ^#ffffff| Armour: ^#5e81ac${character.armour !== null ? character.armour : 'N/A'} ^#ffffff| Statuses: ^#5e81ac${character.statuses || 'N/A'}`);
  } catch (error) {
    console.error('/viewchar:', error);
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffAn error occurred while trying to view character.');
  }
},
  {
    params: [
      {
        name: 'stateId',
        paramType: 'string',
        optional: false,
      },
    ],
    restricted: 'group.admin',
  },
);

addCommand(['updatechar'], async (source: number, args: { stateId: string; firstName: string; lastName: string }): Promise<void> => {
  const player = GetPlayer(source);

  if (!player.charId) return;

  const stateId: string = args.stateId;
  const firstName: string = args.firstName;
  const lastName: string = args.lastName;

  try {
    const character = await db.updateCharacterName(stateId, firstName, lastName);
    if (!character) {
      exports.chat.addMessage(source, `^#d73232ERROR ^#ffffffCharacter with ID ${stateId} does not exist.`);
      return;
    }

    exports.chat.addMessage(source, `^#5e81acSuccessfully changed character's name to ^#ffffff${firstName} ${lastName}`);
  } catch (error) {
    console.error('/updatechar:', error);
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffAn error occurred while trying to update the name of the character.');
  }
},
  {
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
  },
);

addCommand(['countchars'], async (source: number): Promise<void> => {
  const player = GetPlayer(source);

  if (!player.charId) return;

  try {
    const count: number = await db.fetchCharacterCount();
    exports.chat.addMessage(source, `^#5e81ac[INFO] ^#ffffffThere are currently ^#5e81ac${count} ^#ffffffcharacters in the database.`);
  } catch (error) {
    console.error('/countchars:', error);
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffAn error occurred while trying to count characters.');
  }
},
  {
    restricted: 'group.admin',
  },
);

addCommand(['deleteinactivechars'], async (source: number, args: { limit?: string }): Promise<void> => {
  const player = GetPlayer(source);

  if (!player.charId) return;

  const limit: number = args.limit ? parseInt(args.limit) : 30;
  if (isNaN(limit) || limit <= 0) {
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffInvalid number of days specified.');
    return;
  }

  try {
    const count: number = await db.deleteInactiveCharacters(limit);
    if (count === 0) {
      exports.chat.addMessage(source, `^#5e81ac[ADMIN] ^#ffffffNo inactive characters were found for deletion.`);
    } else {
      exports.chat.addMessage(source, `^#5e81ac[ADMIN] ^#ffffffDeleted ^#5e81ac${count} ^#ffffffinactive characters who haven't been active for more than ${limit} days.`);
    }
  } catch (error) {
    console.error('/deleteinactivechars:', error);
    exports.chat.addMessage(source, '^#d73232ERROR ^#ffffffAn error occurred while trying to delete inactive characters.');
  }
},
  {
    params: [
      {
        name: 'limit',
        paramType: 'string',
        optional: true, // Default 30 days if no limit is provided, can leave as optional.
      },
    ],
    restricted: 'group.admin',
  },
);

on('onResourceStart', async (resourceName: string): Promise<void> => {
  if (resourceName !== 'prisma') return;

  await Cfx.Delay(100);

  try {
    await db.connect();
    console.log('[PRISMA] Successfully connected to database!');
  } catch (error) {
    console.error('[PRISMA] Failed to connect to database:', error);
  } finally {
    await db.disconnect();
  }
});