import 'dotenv/config';
import { DiscordRequest } from ".";

export type Choice = {
  name: string,
  value: string
};

// 1  SUB_COMMAND
// 2  SUB_COMMAND_GROUP
// 3  STRING
// 4  INTEGER            Any integer between -2^53 and 2^53
// 5  BOOLEAN
// 6  USER
// 7  CHANNEL            Includes all channel types + categories
// 8  ROLE	
// 9  MENTIONABLE        Includes users and roles
// 10 NUMBER            Any double between -2^53 and 2^53
// 11 ATTACHMENT        attachment object
export type CommandOptions = {
  name: string,
  type: number,
  description: string,
  required: boolean,
  choices?: Choice[],
  max_length?: number
};

export type Command = {
  name: string,
  type: number,
  description: string,
  options?: CommandOptions[]
};

const cmdPrefix = process.env.COMMAND_PREFIX ?? "";

// Simple test command
export const TEST_COMMAND: Command = {
  name: `${cmdPrefix}test`,
  description: 'Poke the robot',
  type: 1,
};

// Command containing options
export const ASK_COMMAND: Command = {
  name: `${cmdPrefix}askgpt`,
  description: 'Ask a question',
  options: [
    {
      type: 3,
      name: 'question',
      description: 'Ask Chat GPT',
      required: true,
      max_length: 1000
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, ASK_COMMAND];

export async function RegisterGlobalCommands(appId: string, token: string, commands: Command[] = ALL_COMMANDS) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, token, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

export async function GetGlobalCommands(appId: string, token: string): Promise<Command[]> {
  const endpoint = `applications/${appId}/commands`;  
  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    const response = await DiscordRequest(endpoint, token, { method: 'GET' });
    const jsonres = await response.json();
    console.log(jsonres);
    return jsonres;
  } catch (err) {
    console.error(err);
    return []
  }
}
