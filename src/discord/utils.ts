import 'dotenv/config';
import { Request, Response } from "express";
import { verifyKey } from 'discord-interactions';

export const VerifyDiscordRequest = (clientKey: string) => (req: Request, res: Response, buf: Buffer) => {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');
    if (!(signature != null
    && timestamp != null
    && verifyKey(buf, signature, timestamp, clientKey))) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };

export async function DiscordRequest<T>(endpoint: string, token: string, options: {method: string, body?: object}) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;

  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/zzacal/disgpt, 1.0.0)',
    },
    method: options.method,
    body: options.body != null ? JSON.stringify(options.body) : undefined
  });

  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.error(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res.json() as T;
}

export function segmentMessage(message: string, segmentLimit: number): string[] {
  const segments: string[] = [];

  for (let i = 0; i < message.length; i += segmentLimit) {
    segments.push(message.slice(i, i + segmentLimit));
  }

  return segments;
}

export function segmentMessageAtSpaces(message: string, segmentLimit: number): string[] {
  const segments: string[] = [];

  while (message.length > segmentLimit) {
    let index = message.lastIndexOf(" ", segmentLimit);
    if (index === -1) {
      index = segmentLimit;
    }
    const segment = message.slice(0, index);
    segments.push(segment);
    message = message.slice(index + 1);
  }

  if (message.length > 0) {
    segments.push(message);
  }

  return segments;
}
