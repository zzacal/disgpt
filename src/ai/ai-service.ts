import { OpenAIApi } from "openai";

export class AIService {
  constructor(private openai: OpenAIApi) {}

  async ask(prompt: string): Promise<AskResult> {
    try{
      const result = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        temperature: 0.7
      })
      
      return {
        prompt,
        result: result.data.choices.map(c => c.message?.content).join("\n") ?? ""
      };
    } catch (e) {
      console.error(e);
      return {
        prompt,
        result: ""
      };
    }
  }
}

export type AskResult = {
  prompt: string,
  result: string
}
