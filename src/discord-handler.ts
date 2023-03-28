import { InteractionResponseType, InteractionType } from "discord-interactions";
import { AIService } from "./ai/ai-service";
import { DiscordRequest, getRandomEmoji } from "./utils";

export async function HandleDiscordRequest(chat: AIService, appId: string, botToken: string, interaction: Interaction): Promise<InteractionResponse | undefined> {
  // Interaction type and data
  const { type, token, data, member: {user: {display_name, username}} } = interaction;

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
        const question = data.options[0].value;
        chat.ask(question).then(answer => {
          let content = `**${question}**\n${answer}`;
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
      default:
        console.log(interaction);
        break;
    }
  }
}

export type Interaction = {
  app_permissions: string
  application_id: string
  channel_id: string
  data: Data
  entitlement_sku_ids: any[]
  entitlements: any[]
  guild_id: string
  guild_locale: string
  id: string
  locale: string
  member: Member
  token: string
  type: number
  version: number
}

export type Data = {
  id: string
  name: string
  options: Option[]
  type: number
}

export type Option = {
  name: string
  type: number
  value: string
}

export type Member = {
  avatar: any
  communication_disabled_until: any
  deaf: boolean
  flags: number
  is_pending: boolean
  joined_at: string
  mute: boolean
  nick: any
  pending: boolean
  permissions: string
  premium_since: any
  roles: any[]
  user: User
}

export type User = {
  avatar: string
  avatar_decoration: any
  discriminator: string
  display_name: any
  global_name: any
  id: string
  public_flags: number
  username: string
}

export type InteractionResponse = { 
  type: InteractionResponseType; 
  data?: any 
};
