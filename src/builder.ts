import express, { Express } from "express";
import { ChatService } from "./chatgpt/chat-service";
import { Command } from "./commands";
import { HandleDiscordRequest } from "./discord-handler";
import {
  InstallGlobalCommands,
  VerifyDiscordRequest,
} from "./utils";

export class Builder {
  /**
   *
   */
  constructor() {}

  public build = async (
    chatService: ChatService,
    APPID: string,
    PUBLIC_KEY: string,
    DISCORD_BOT_TOKEN: string,
    ALL_COMMANDS: Command[]
  ): Promise<Express> => {
    // Create an express app
    const app = express();

    await InstallGlobalCommands(APPID, DISCORD_BOT_TOKEN, ALL_COMMANDS);

    // Parse request body and verifies incoming requests using discord-interactions package
    app.use(express.json({ verify: VerifyDiscordRequest(PUBLIC_KEY) }));

    // Store for in-progress games. In production, you'd want to use a DB
    const activeGames = {};

    /**
     * Interactions endpoint URL where Discord will send HTTP requests
     */
    app.post("/interactions", async function (req, res) {
      const result = await HandleDiscordRequest(chatService, APPID, DISCORD_BOT_TOKEN, req.body);
      if(result)
      {
        res.send(result);
      }
    });

    app.get("/ping", (req, res) => {res.sendStatus(200)});

    return app;
  };
}
