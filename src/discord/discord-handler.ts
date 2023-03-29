import { InteractionResponseType, InteractionType } from "discord-interactions";
import { AIService } from "../ai/ai-service";
import { ASK_COMMAND, DiscordRequest, DRAW_COMMAND, TEST_COMMAND } from "./";
import { Interaction, InteractionResponse } from "./interaction";

export async function HandleDiscordRequest(chat: AIService, appId: string, botToken: string, interaction: Interaction): Promise<InteractionResponse | undefined> {
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
      case TEST_COMMAND.name:
        return {
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // Fetches a random emoji to send from a helper function
            content: "hello world " + getRandomEmoji(),
          },
        };
      case ASK_COMMAND.name:
        chat.ask(data.options[0].value).then( ({ prompt, result }) => {
          let content = `**${prompt}**\n${result}`;
          if(content.length > 2000) {
            content = content.substring(0,2000);
          }

          DiscordRequest(
            `webhooks/${appId}/${token}`,
            botToken,
            {
              method: "POST",
              body: {
                content
              },
            }
          );
        })

        return {
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
        };

      case DRAW_COMMAND.name:
        chat.draw(data.options[0].value).then( ({ prompt, result }) => {
          let content = `**${prompt}**`;

          DiscordRequest(
            `webhooks/${appId}/${token}`,
            botToken,
            {
              method: "POST",
              body: {
                content,
                embeds: [{
                  "image": {
                    "url": result
                  }
                }]
              },
            }
          );
        });
        
        return {
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
        };
      default:
        console.log(interaction);
        break;
    }
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji(): string {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}
