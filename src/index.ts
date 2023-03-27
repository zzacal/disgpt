import 'dotenv/config';
import { ALL_COMMANDS } from './commands';
import { Builder } from './builder';
import { ChatService } from './chatgpt/chat-service';
import { Configuration, OpenAIApi } from 'openai';

const APPID = process.env.APP_ID!;
const PUBLIC_KEY = process.env.PUBLIC_KEY!
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const PORT = process.env.PORT || 3000;
const OPEN_AI_API = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));
const CHAT_SERVICE = new ChatService(OPEN_AI_API);

(new Builder())
  .build(CHAT_SERVICE, APPID, PUBLIC_KEY, DISCORD_BOT_TOKEN, ALL_COMMANDS)
  .then( app => app.listen(PORT, () => console.log(`app: ${APPID}\nlistening: ${PORT}`)))
