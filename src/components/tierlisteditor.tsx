'use client'

import { TierList, TierWithEntries } from '@/types/database'
import GameSearch from '@/components/gamesearch'
import { Game } from '@/types/game'
import { useState } from 'react'


type Props = {
    tierlist : TierList
    tiers : TierWithEntries[]
}

type LocalTier = {
    id : string
    label : string
    games : Game[]
}

const TIER_COLORS: Record<string, string> = {
  S : 'bg-red-500',
  A : 'bg-orange-500',
  B : 'bg-yellow-500',
  C : 'bg-green-500',
  D : 'bg-blue-500',
}


export default function TierListEditor( { tierlist, tiers }: Props ) {
    const [localTiers, setLocalTiers] = useState<LocalTier[]>(
        tiers.map(tier => ({
            id: tier.id,
            label: tier.label,
            games: []
        }))
    )

    function onDrop(e: React.DragEvent, tierId: string) {
        const game: Game = {
            id : parseInt(e.dataTransfer.getData('id')),
            name : e.dataTransfer.getData('name'),
            imageUrl : e.dataTransfer.getData('imageUrl') || null
        }
        
        const prevTierId = e.dataTransfer.getData('tierId') || localTiers.find(tier => tier.games.some(g => g.id === game.id))?.id || null

        if ( tierId === prevTierId ) return 

        setLocalTiers( prev => prev.map( tier => {
            if ( tier.id === tierId ) return { ...tier, games: [ ...tier.games, game ] }
            if ( tierId === "remove" ) return { ...tier, games: tier.games.filter( g => g.id !== game.id ) }
            if ( tier.id === prevTierId ) return { ...tier, games: tier.games.filter( g => g.id !== game.id ) }
            
            return tier
        }))
    }
    
    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <h1 className="text-3xl font-bold mb-8">{ tierlist.name }</h1>

            <div className="flex flex-col gap-2">
                { localTiers.map( tier => (
                    <div key={ tier.id } className="flex items-stretch min-h-20 rounded overflow-hidden border border-slate-700">
                        
                        { /* Tier label */ }
                        <div className={ `flex items-center justify-center w-16 shrink-0 text-white font-black text-2xl ${ TIER_COLORS[ tier.label ] ?? 'bg-slate-600' }` }>
                            { tier.label }
                        </div>

                        { /* Games in this tier */ }
                        <div className="flex flex-wrap gap-2 p-2 bg-slate-800 flex-1"
                            onDragOver={ ( e ) => e.preventDefault() }
                            onDrop={ ( e ) => onDrop( e, tier.id ) }>
                            { tier.games.length === 0 
                                ? ( <span className="text-slate-500 text-sm self-center px-2">Drop games here</span> )
                                : ( tier.games.map( game => 
                                    (
                                        <div
                                            key={game.id}
                                            draggable onDragStart={ ( e ) => {
                                                e.dataTransfer.setData( 'id', game.id.toString() )
                                                e.dataTransfer.setData('name', game.name)
                                                e.dataTransfer.setData('imageUrl', game.imageUrl ?? '')
                                                e.dataTransfer.setData('tierId', tier.id)
                                            }}
                                            className="relative w-24 h-24 rounded overflow-hidden cursor-pointer group border border-slate-600 hover:border-blue-400 transition-colors"
                                        >
                                            { game.imageUrl
                                                ? <img src={game.imageUrl} alt={game.name} className="w-full h-full object-cover"/>
                                                : <div className="w-full h-full bg-slate-600"/>
                                            }
                                            <div className="absolute inset-0 bg-black/30 flex items-end p-1">
                                                <span className="text-white text-[12px] font-bold leading-tight uppercase drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">
                                                    {game.name}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6" onDragOver={ ( e ) => e.preventDefault() } onDrop={ ( e ) => onDrop( e, "remove" ) }>
                <GameSearch />
            </div>
        </div>
    )
}