import express, { Express } from "express";
import { AIService } from "./ai/ai-service";
import { HandleDiscordRequest, VerifyDiscordRequest } from "./discord";

export class ExpressAppBuilder {
  public build = async (
    chatService: AIService,
    appId: string,
    publicKey: string,
    discordBotToken: string
  ): Promise<Express> => {
    // Create an express app
    const app = express();

    // Parse request body and verifies incoming requests using discord-interactions package
    app.use(express.json({ verify: VerifyDiscordRequest(publicKey) }));

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

    app.get("/ping", (_req, res) => {res.sendStatus(200)});

    return app;
  };
}
