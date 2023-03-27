import { InteractionResponseType, InteractionType } from "discord-interactions";
import { ChatService } from "./chatgpt/chat-service";
import { DiscordRequest, getRandomEmoji } from "./utils";

export type Interaction = { type: InteractionType; id: string; token: string, data: any };
export type InteractionResponse = { type: InteractionResponseType; data?: any };

export async function HandleDiscordRequest(chat: ChatService, appId: string, botToken: string, interaction: Interaction): Promise<InteractionResponse | undefined> {
  // Interaction type and data
  const { type, token, data } = interaction;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return { type: InteractionResponseType.PONG };
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    switch (data.name) {
      case "test":
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: "hello world " + getRandomEmoji(),
          },
        };
      case "askgpt":
        chat.ask(data.options[0].value).then(answer => {
          DiscordRequest(
            `webhooks/${appId}/${token}`,
            botToken,
            {
              method: "POST",
              body: {
                content: answer,
                // type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              },
            }
          );
        })

        return {
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
        };
      default:
        console.log(interaction);
        break;
    }
  }
}
