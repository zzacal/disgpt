import 'dotenv/config';
import { ExpressAppBuilder } from './builder';
import { AIService } from './ai/ai-service';
import { Configuration, OpenAIApi } from 'openai';
import { ALL_COMMANDS, DiscordClient, GetGlobalCommands, RegisterGlobalCommands } from './discord';
import { Cooldowns } from './limiter/cooldown';

const APPID = process.env.APP_ID;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (APPID != null
    && PUBLIC_KEY != null
    && DISCORD_BOT_TOKEN != null
    && OPENAI_API_KEY != null) {

  const OPEN_AI_API = new OpenAIApi(new Configuration({
    apiKey: OPENAI_API_KEY,
  }));
  const AI_SERVICE = new AIService(OPEN_AI_API);
  
  
  const COOLDOWNS = new Cooldowns(20000);
  
  const PORT = process.env.PORT ?? 3000;
  const DISCORD_CLIENT = new DiscordClient("https://discord.com/api/v10/", DISCORD_BOT_TOKEN)

  // Checks if global commands need to be updated
  GetGlobalCommands(APPID, DISCORD_BOT_TOKEN).then((commands) => {
    if (commands.length < ALL_COMMANDS.length) {
      console.info("Register commands started");
      RegisterGlobalCommands(APPID, DISCORD_BOT_TOKEN).then(() => {
        console.info("Register commands complete");
      });
    }
  });
      
  (new ExpressAppBuilder())
    .build(DISCORD_CLIENT, COOLDOWNS, AI_SERVICE, APPID, PUBLIC_KEY, DISCORD_BOT_TOKEN)
    .then( app => app.listen(PORT, () => console.log(`app: ${APPID}\nlistening: ${PORT}`)))

} else {
  throw new Error("disgpt is misconfigured.\nAPPID && PUBLIC_KEY && DISCORD_BOT_TOKEN && OPENAI_API_KEY are all required, but at least one is of them is missing.")
}
