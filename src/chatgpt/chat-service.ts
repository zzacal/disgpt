import { OpenAIApi } from "openai";

export class ChatService {
  constructor(private openai: OpenAIApi) {}

  async ask(prompt: string): Promise<string> {
    try{
      const completion = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt
      });
      
      return completion.data.choices[0].text ?? "";
    } catch (e) {
      return "";
    }
  }
}
