export type TierList = {
    id: string
    created_at: string
    user_id: string
    name: string
}

export type Tier = {
    id: string
    created_at: string
    tierlist_id: string
    label: string
    rank: number
}

export type TierEntry = {
    id: string
    created_at: string
    tier_id: string
    game_id: string
    position: number
    name: string
    image_url: string | null
}

export type TierWithEntries = Tier & {
  tierentry: TierEntry[]
}