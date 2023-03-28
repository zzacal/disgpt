import { InteractionResponseType } from "discord-interactions"

export type Interaction = {
  app_permissions: string
  application_id: string
  channel_id: string
  data: Data
  entitlement_sku_ids: string[]
  entitlements: unknown[]
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
  avatar: unknown
  communication_disabled_until: unknown
  deaf: boolean
  flags: number
  is_pending: boolean
  joined_at: string
  mute: boolean
  nick: string
  pending: boolean
  permissions: string
  premium_since: unknown
  roles: unknown[]
  user: User
}

export type User = {
  avatar: string
  avatar_decoration: unknown
  discriminator: string
  display_name: string
  global_name: string
  id: string
  public_flags: number
  username: string
}

export type InteractionResponse = { 
  type: InteractionResponseType; 
  data?: object 
};
