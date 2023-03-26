import 'dotenv/config';
import { Request, Response } from "express";
import { verifyKey } from 'discord-interactions';

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

