export class DiscordClient {
  constructor(private apiBaseUrl: string, private token: string) {}

  // helper function to send requests to Discord API
  async discordApiRequest(path: string, options?: RequestInit) {
    const url = `${this.apiBaseUrl}${path}`;
    const headers = {
      Authorization: `Bot ${this.token}`,
      "Content-Type": "application/json",
    };
    const response = await fetch(url, { headers, ...options });
    if (!response.ok) {
      throw new Error(
        `Discord API error: ${response.status} ${await response.text()}`
      );
    }
    return response.json();
  }

  // create a new thread that is not connected to an existing message
  async startThread(options: CreateThreadOptions, channelId: string) {
    const response = await this.discordApiRequest(`/channels/${channelId}/threads`, {
      method: "POST",
      body: JSON.stringify(options),
    });
    return response;
  }

  // create a new thread from an existing message
  async startThreadFromMessage(
    options: StartThreadFromMessageOptions,
    channelId: string
  ) {
    const response = await this.discordApiRequest(
      `/channels/${channelId}/messages/${options.messageId}/threads`,
      {
        method: "POST",
        body: JSON.stringify(options),
      }
    );
    return response;
  }

  async createMessage(channelId: Snowflake, params: MessageCreateParams): Promise<any> {
    const url = `/channels/${channelId}/messages`;
    const headers = {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify(params);
    const response = await this.discordApiRequest(url, {
      method: 'POST',
      body,
    });
    return response;
  }
}

interface CreateThreadOptions {
  name: string;
  auto_archive_duration?: number;
  type?: number;
  invitable?: boolean;
  rate_limit_per_user?: number;
}

interface StartThreadFromMessageOptions extends CreateThreadOptions {
  messageId: string;
}

interface StartThreadInForumChannelOptions extends CreateThreadOptions {
  message: {
    content?: string;
    embeds?: any[];
    allowed_mentions?: any;
    components?: any[];
    sticker_ids?: string[];
    files?: any[];
  };
  applied_tags?: string[];
}
interface MessageCreateParams {
  content?: string;
  tts?: boolean;
  embeds?: Embed[];
  allowed_mentions?: AllowedMentions;
  message_reference?: MessageReference;
  components?: MessageComponent[];
  sticker_ids?: Snowflake[];
  files?: File[];
  payload_json?: string;
  attachments?: Attachment[];
  flags?: number;
}

interface Embed {
  title?: string;
  description?: string;
  // add other properties as needed
}

interface AllowedMentions {
  // add properties as needed
}

interface MessageReference {
  message_id?: Snowflake;
  channel_id?: Snowflake;
  guild_id?: Snowflake;
  fail_if_not_exists?: boolean;
}

interface MessageComponent {
  // add properties as needed
}

interface Attachment {
  filename?: string;
  description?: string;
  // add other properties as needed
}

type Snowflake = string;

export type DiscordMessage = {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    global_name: string | null;
    display_name: string | null;
    avatar: string;
    avatar_decoration: string | null;
    discriminator: string;
    public_flags: number;
    bot: boolean;
  };
  attachments: unknown[]; // not enough information provided to determine type
  embeds: unknown[]; // not enough information provided to determine type
  mentions: unknown[]; // not enough information provided to determine type
  mention_roles: unknown[]; // not enough information provided to determine type
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  timestamp: string;
  edited_timestamp: string | null;
  flags: number;
  components: unknown[]; // not enough information provided to determine type
  application_id: string;
  interaction: {
    id: string;
    type: number;
    name: string;
    user: {
      id: string;
      username: string;
      global_name: string | null;
      display_name: string | null;
      avatar: string;
      avatar_decoration: string | null;
      discriminator: string;
      public_flags: number;
    };
  };
  webhook_id: string;
}
