import { InstallGlobalCommands } from "./utils";

export type Choice = {
  name: string,
  value: string
};

// 1 SUB_COMMAND
// 2 SUB_COMMAND_GROUP
// 3 STRING
// 4 INTEGER            Any integer between -2^53 and 2^53
// 5 BOOLEAN
// 6 USER
// 7 CHANNEL            Includes all channel types + categories
// 8 ROLE	
// 9 MENTIONABLE        Includes users and roles
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

// Simple test command
const TEST_COMMAND: Command = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

// Command containing options
const CHALLENGE_COMMAND: Command = {
  name: 'askgpt',
  description: 'Ask a question',
  options: [
    {
      type: 3,
      name: 'question',
      description: 'Pick your object',
      required: true,
      max_length: 1000
    },
  ],
  type: 1,
};


export const ALL_COMMANDS = [TEST_COMMAND, CHALLENGE_COMMAND];
