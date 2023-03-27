import { OpenAIApi } from "openai";

export class ChatService {
  constructor(private openai: OpenAIApi) {}

  async ask(prompt: string): Promise<string> {
    try{
      const result = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        temperature: 0.7
      })
      
      return result.data.choices.map(c => c.message?.content).join("\n") ?? "";
    } catch (e) {
      console.error(e);
      return "";
    }
  }
}
