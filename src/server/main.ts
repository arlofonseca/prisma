import * as Cfx from "@nativewrappers/fivem/server";
import { GetPlayer } from "@overextended/ox_core/server";
import { cache } from "@overextended/ox_lib";
import { addCommand } from "@overextended/ox_lib/server";
import { characters } from "@prisma/client";
import { searchCharacters } from "@prisma/client/sql";
import db from "../utils/database";

/* Functions */

async function changeName(source: number, args: { playerId: number; firstName: string; lastName: string }) {
  const player = GetPlayer(source);

  if (!player?.charId) return;

  try {
    const playerId = args.playerId;
    const firstName = args.firstName;
    const lastName = args.lastName;

    const target = GetPlayer(playerId);
    if (!target?.charId) {
      exports.chat.addMessage(source, `^#d73232ERROR ^#ffffffNo player found with id ${playerId}.`);
      return;
    }

    await db.updateCharacterName(target.charId, firstName, lastName);
    exports.chat.addMessage(source, `^#5e81acSuccessfully changed ^#ffffff${target.get("name")} ^#5e81acname to ^#ffffff${firstName} ${lastName}`);
  } catch (error) {
    console.error("changeName:", error);
    exports.chat.addMessage(source, "^#d73232ERROR ^#ffffffAn error occurred while trying to update the name of the character.");
  }
}

async function deleteInactiveChars(source: number, args: { limit?: number }): Promise<void> {
  const player = GetPlayer(source);

  if (!player?.charId) return;

  try {
    const limit = args.limit ?? 30;
    if (isNaN(limit) || limit <= 0) return;

    const count = await db.deleteInactiveCharacters(limit);
    if (count === 0) {
      exports.chat.addMessage(source, `^#d73232ERROR ^#ffffffNo inactive characters were found for deletion.`);
      return;
    }

    exports.chat.addMessage(source, `^#5e81acSuccessfully deleted ^#ffffff${count} ^#5e81acfinactive characters who haven't been active for more than ^#ffffff${limit} ^#5e81acdays`);
  } catch (error) {
    console.error("deleteInactiveChars:", error);
    exports.chat.addMessage(source, "^#d73232ERROR ^#ffffffAn error occurred while trying to delete inactive characters.");
  }
}

async function getChar(source: number, args: { stateId: string }): Promise<void> {
  const player = GetPlayer(source);

  if (!player?.charId) return;

  try {
    const stateId = args.stateId;
    if (typeof stateId !== "string" || !isNaN(Number(stateId))) {
      exports.chat.addMessage(source, "^#d73232ERROR ^#ffffffInvalid State ID provided.");
      return;
    }

    const character = await db.getCharacterByStateId(stateId);
    if (!character) {
      exports.chat.addMessage(source, `^#d73232ERROR ^#ffffffNo character found with State ID ${stateId}.`);
      return;
    }

    exports.chat.addMessage(source, "^#5e81ac--------- ^#ffffffCharacter Details ^#5e81ac---------");
    exports.chat.addMessage(source, `^#5e81acCharacter ID: ^#ffffff${character.charId}`);
    exports.chat.addMessage(source, `^#5e81acUser ID: ^#ffffff${character.userId}`);
    exports.chat.addMessage(source, `^#5e81acName: ^#ffffff${character.firstName} ${character.lastName ?? ""}`);
    exports.chat.addMessage(source, `^#5e81acDOB: ^#ffffff${character.dateOfBirth ?? "N/A"}`);
    exports.chat.addMessage(source, `^#5e81acGender: ^#ffffff${character.gender ?? "N/A"}`);
    exports.chat.addMessage(source, `^#5e81acLast Played: ^#ffffff${character.lastPlayed?.toLocaleString() ?? "N/A"}`);
  } catch (error) {
    console.error("getChar:", error);
    exports.chat.addMessage(source, "^#d73232ERROR ^#ffffffAn error occurred while fetching character details.");
  }
}

async function searchChar(source: number, args: { firstName: string }): Promise<void> {
  const player = GetPlayer(source);

  if (!player?.charId) return;

  try {
    const firstName = args.firstName;

    const characters = await db.getCharacterByFirstName(firstName);
    if (characters.length === 0) {
      exports.chat.addMessage(source, `^#d73232ERROR ^#ffffffCharacter with name ${firstName} does not exist.`);
      return;
    }

    exports.chat.addMessage(source, "^#5e81ac--------- ^#ffffffCharacter Results ^#5e81ac---------");
    for (const character of characters) {
      exports.chat.addMessage(source, `^#5e81ac${character.lastName ? `${character.firstName} ${character.lastName}` : character.firstName}`);
    }
  } catch (error) {
    console.error("searchChar:", error);
    exports.chat.addMessage(source, "^#d73232ERROR ^#ffffffAn error occurred while trying to search for characters.");
  }
}

async function fetchCharacterNames(source: number): Promise<void> {
  const player = GetPlayer(source);

  if (!player?.charId) return;

  try {
    // @ts-ignore
    const characters: characters[] = await db.rawQuery<characters[]>(searchCharacters() as any);
    if (characters.length === 0) return;

    exports.chat.addMessage(source, "^#5e81ac--------- ^#ffffffCharacter Names ^#5e81ac---------");
    for (const character of characters) {
      exports.chat.addMessage(source, `^#5e81ac${character.firstName ?? "N/A"} ${character.lastName ?? "N/A"} ^#ffffff| DOB: ^#5e81ac${character.dateOfBirth ?? "N/A"} ^#ffffff| Gender: ^#5e81ac${character.gender ?? "N/A"}`);
    }
  } catch (error) {
    console.error("fetchCharacterNames:", error);
    exports.chat.addMessage(source, "^#d73232ERROR ^#ffffffAn error occurred while fetching character names.");
  }
}

/* Commands */

addCommand(["changename"], changeName, {
  params: [
    {
      name: "playerId",
      paramType: "number",
      optional: false,
    },
    {
      name: "firstName",
      paramType: "string",
      optional: false,
    },
    {
      name: "lastName",
      paramType: "string",
      optional: false,
    },
  ],
  restricted: "group.admin",
});

addCommand(["deleteinactivechars"], deleteInactiveChars, {
  params: [
    {
      name: "limit",
      paramType: "number",
      optional: true, // Default 30 days if no limit is provided, can leave as optional.
    },
  ],
  restricted: "group.admin",
});

addCommand(["getchar"], getChar, {
  params: [
    {
      name: "stateId",
      paramType: "string",
      optional: false,
    },
  ],
  restricted: "group.admin",
});

addCommand(["searchchar"], searchChar, {
  params: [
    {
      name: "firstName",
      paramType: "string",
      optional: false,
    },
  ],
  restricted: "group.admin",
});

addCommand(["fetchcharacternames"], fetchCharacterNames, {
  restricted: "group.admin",
});

on("onResourceStart", async (resourceName: string): Promise<void> => {
  if (resourceName !== "prisma") return;

  await Cfx.Delay(100);

  try {
    await db.connect();
    console.log(`\x1b[32m[${cache.resource}] Successfully connected to database!\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[${cache.resource}] Failed to connect to database: ${error}\x1b[0m`);
  } finally {
    await db.disconnect();
  }
});