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
    id: string | null
    created_at: string | null
    tier_id: string
    game_id: number
    position: number
}

export type TierWithEntries = Tier & {
  tierentry: TierEntry[]
}