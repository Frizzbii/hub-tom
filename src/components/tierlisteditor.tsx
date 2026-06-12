'use client'

import { TierList, TierWithEntries } from '@/types/database'
import GameSearch from '@/components/gamesearch'
import { Game } from '@/types/game'
import { useState } from 'react'


type Props = {
    tierlist: TierList
    tiers: TierWithEntries[]
}

type LocalTier = {
    id: string
    label: string
    games: Game[]
}

const TIER_COLORS: Record<string, string> = {
  S: 'bg-red-500',
  A: 'bg-orange-500',
  B: 'bg-yellow-500',
  C: 'bg-green-500',
  D: 'bg-blue-500',
}


export default function TierListEditor( { tierlist, tiers }: Props ) {
    const [localTiers, setLocalTiers] = useState<LocalTier[]>(
        tiers.map(tier => ({
            id: tier.id,
            label: tier.label,
            games: []
        }))
    )
    
    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-8">{ tierlist.name }</h1>

            <div className="flex flex-col gap-2">
                { tiers.map( tier => (
                    <div key={ tier.id } className="flex items-stretch min-h-20 rounded overflow-hidden border border-slate-700">
                        
                        { /* Tier label */ }
                        <div className={ `flex items-center justify-center w-16 shrink-0 text-white font-black text-2xl ${ TIER_COLORS[ tier.label ] ?? 'bg-slate-600' }` }>
                            { tier.label }
                        </div>

                        { /* Games in this tier */ }
                        <div className="flex flex-wrap gap-2 p-2 bg-slate-800 flex-1"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                const id = e.dataTransfer.getData('id')
                                const name = e.dataTransfer.getData('name')
                                const imageUrl = e.dataTransfer.getData('imageUrl')
                                //setLocalTiers()
                            }}>
                            { tier.tierentry.length === 0 
                                ? ( <span className="text-slate-500 text-sm self-center px-2">Drop games here</span> )
                                : ( tier.tierentry.map( entry => 
                                    (
                                        <div key={ entry.id } className="w-16 h-16 bg-slate-600 rounded flex items-center justify-center text-xs text-center text-slate-300 p-1">
                                            { entry.game_id }
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <GameSearch />
            </div>
        </div>
    )
}