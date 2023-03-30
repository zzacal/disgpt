class DiscordClient {
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
