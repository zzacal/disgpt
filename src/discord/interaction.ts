import { InteractionResponseType } from "discord-interactions"

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
