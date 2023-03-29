import { InteractionResponseType, InteractionType } from "discord-interactions";
import { AIService } from "../ai/ai-service";
import { Cooldowns } from "../limiter/cooldown";
import { ASK_COMMAND, DiscordRequest, DRAW_COMMAND, TEST_COMMAND } from "./";
import { Interaction, InteractionResponse } from "./interaction";

export async function HandleDiscordRequest(cooldowns: Cooldowns,chat: AIService, appId: string, botToken: string, interaction: Interaction): Promise<InteractionResponse | undefined> {
  // Interaction type and data
  const { type, token, data, member: { user } } = interaction;

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
            content: getAd(user.display_name ?? user.username, cooldowns.get(user.id))
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
        if(cooldowns.get(user.id) > 0) {
          return {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: getAd(user.display_name ?? user.username, cooldowns.get(user.id))
            }
          }
        }
        chat.draw(data.options[0].value).then( ({ prompt, result }) => {
          const content = `**${prompt}**`;

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

          cooldowns.set(user.id);
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

function getAd(name: string, time: number) {
  return `**${name}**: ${getSlogan()(getSponsor())}\n`
}

function getSlogan() {
  const ads = 
  [(sponsor: string) => `Unlock the power of ${sponsor} and change your life forever!`,
  (sponsor: string) => `${sponsor}. The best thing ever invented!`,
  (sponsor: string) => `${sponsor} is so amazing, you won't believe ${sponsor}'s real!`,
  (sponsor: string) => `Experience ${sponsor}. Experience the ultimate in luxury!`,
  (sponsor: string) => `Unleash your inner superhero with our ${sponsor}!`,
  (sponsor: string) => `${sponsor}. Revolutionizing the way you live your life!`,
  (sponsor: string) => `Transform your world with our game-changing product, ${sponsor}!`,
  (sponsor: string) => `${sponsor}. The most incredible thing you'll ever own!`,
  (sponsor: string) => `${sponsor}. Get ready for the ride of your life!`,
  (sponsor: string) => `The answer to all your dreams and desires is ${sponsor}!`,
  (sponsor: string) => `A product so good, ${sponsor} will blow your mind!`,
  (sponsor: string) => `${sponsor}. Join the revolution and experience the future today!`];
  return ads[Math.floor(Math.random() * ads.length)];
}

function getSponsor(): string{
  const sponsors = [
    "Snackie Crisps",
    "GlowBrew Coffee",
    "ChillFrost Energy Drink",
    "ZestMate Toothpaste",
    "PowerFlare Batteries",
    "AquaGlow Water",
    "SootheEase Pain Relief Cream",
    "DreamBite Sleep Aid Gummies",
    "PureZone Air Purifier",
    "FitFuel Protein Bars",
    "TimeOut Relaxation Tea",
    "ClearVision Eye Drops",
    "ZenZone Meditation App",
    "VitalBlend Nutritional Supplements",
    "SparkBlaze Fire Starter",
    "SkinRevive Moisturizer",
    "MindBalance Memory Booster",
    "CleanSweep All-Purpose Cleaner",
    "FreshBreeze Fabric Softener",
    "ChillPill Stress Relief Capsules",];
  return sponsors[Math.floor(Math.random() * sponsors.length)];
}
