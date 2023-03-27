import 'dotenv/config';
import { Request, Response } from "express";
import { verifyKey } from 'discord-interactions';
import { Command } from './commands';

export const VerifyDiscordRequest = (clientKey: string) => (req: Request, res: Response, buf: Buffer, encoding: string) => {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    if (!(signature 
    && timestamp
    && verifyKey(buf, signature, timestamp, clientKey))) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };

export async function DiscordRequest(endpoint: string, token: string, options: {method: string, body: any}) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId: string, discordBotToken: string, commands: Command[]) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, discordBotToken, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji(): string {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

// export function capitalize(str) {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }

