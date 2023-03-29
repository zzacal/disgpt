import 'dotenv/config';
import { ExpressAppBuilder } from './builder';
import { AIService } from './ai/ai-service';
import { Configuration, OpenAIApi } from 'openai';
import { ALL_COMMANDS, GetGlobalCommands, RegisterGlobalCommands } from './discord';

const APPID = process.env.APP_ID;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const OPEN_AI_API = new OpenAIApi(new Configuration({
  apiKey: OPENAI_API_KEY,
}));
const CHAT_SERVICE = new AIService(OPEN_AI_API);

const PORT = process.env.PORT ?? 3000;

if (APPID != null
    && PUBLIC_KEY != null
    && DISCORD_BOT_TOKEN != null
    && OPENAI_API_KEY != null) {

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
    .build(CHAT_SERVICE, APPID, PUBLIC_KEY, DISCORD_BOT_TOKEN)
    .then( app => app.listen(PORT, () => console.log(`app: ${APPID}\nlistening: ${PORT}`)))

} else {
  throw new Error("disgpt is misconfigured.\nAPPID && PUBLIC_KEY && DISCORD_BOT_TOKEN && OPENAI_API_KEY are all required, but at least one is of them is missing.")
}
