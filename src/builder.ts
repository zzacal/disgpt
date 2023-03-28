import express, { Express } from "express";
import { AIService } from "./ai/ai-service";
import { HandleDiscordRequest, VerifyDiscordRequest } from "./discord";

export class ExpressAppBuilder {
  /**
   *
   */
  constructor() {}

  public build = async (
    chatService: AIService,
    appId: string,
    publicKey: string,
    discordBotToken: string
  ): Promise<Express> => {
    // Create an express app
    const app = express();

    // TODO: Find a better way to do this. Maybe and endpoint
    // await InstallGlobalCommands(APPID, DISCORD_BOT_TOKEN, ALL_COMMANDS);

    // Parse request body and verifies incoming requests using discord-interactions package
    app.use(express.json({ verify: VerifyDiscordRequest(publicKey) }));

    // Store for in-progress games. In production, you'd want to use a DB
    const activeGames = {};

    /**
     * Interactions endpoint URL where Discord will send HTTP requests
     */
    app.post("/interactions", async function (req, res) {
      const result = await HandleDiscordRequest(chatService, appId, discordBotToken, req.body);
      if(result)
      {
        res.send(result);
      }
    });

    app.get("/ping", (req, res) => {res.sendStatus(200)});

    return app;
  };
}
