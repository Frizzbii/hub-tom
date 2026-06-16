'use client'

import { TierList, TierWithEntries } from '@/types/database'
import GameSearch from '@/components/gamesearch'
import { Game } from '@/types/game'
import React, { MouseEventHandler, useState } from 'react'
import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { saveTierList } from '@/app/actions'


type Props = {
    tierlist : TierList
    tiers : TierWithEntries[]
}

export type LocalTier = {
    id : string
    label : string
    rank : number
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
    const [localTiers, setLocalTiers] = useState<LocalTier[]>(() => {
        return (tiers || []).map(tier => {
            const existingGames = tier.tierentry && Array.isArray(tier.tierentry)
                ? [...tier.tierentry]
                    .sort((a: any, b: any) => a.position - b.position)
                    .map((entry: any) => ({
                        id: parseInt(entry.game.id),
                        name: entry.game.name,
                        imageUrl: entry.game.imageUrl
                    }))
                : []

            return {
                id: tier.id,
                label: tier.label,
                rank: tier.rank,
                games: existingGames
            }
        })
    })
    const [dragOverTierId, setDragOverTierId] = useState<string | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number>(0)

    function onDrop(e : React.DragEvent, tierId : string) {
        const game : Game = {
            id : parseInt(e.dataTransfer.getData('id')),
            name : e.dataTransfer.getData('name'),
            imageUrl : e.dataTransfer.getData('imageUrl') || null
        }
        
        const prevTierId = e.dataTransfer.getData('tierId') || localTiers.find(tier => tier.games.some(g => g.id === game.id))?.id || null

        if ( tierId === prevTierId ) return 

        setLocalTiers( prev => prev.map( tier => {
            if ( tier.id === tierId ) {
                const cleanGames = tier.games.filter( g => g.id !== game.id )
                const updatedGames = [ ...cleanGames.slice( 0, dragOverIndex ), game, ...cleanGames.slice( dragOverIndex ) ]
                return { ...tier, games: updatedGames }
            }

            if ( tierId === "remove" )
                return { ...tier, games: tier.games.filter( g => g.id !== game.id ) }

            if (tier.id === prevTierId)
                return { ...tier, games: tier.games.filter(g => g.id !== game.id ) }
            
            return tier;
        }))
    }

    function onDragOver(e : React.DragEvent, tier : LocalTier ) {
        e.preventDefault()
        
        const positionX = e.clientX
        setDragOverTierId( tier.id )

        const container = e.currentTarget as HTMLElement
        const children = Array.from(container.children) as HTMLElement[]

        let closestIndex = tier.games.length

        for (let i = 0; i < children.length; i++) {
            const box = children[i].getBoundingClientRect()
            const boxCenterX = box.left + box.width / 2

            if (positionX < boxCenterX) {
                closestIndex = i
                break
            }
        }

        setDragOverIndex( closestIndex )
    }

    async function handleSave() {
        await saveTierList( tierlist , localTiers )
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
                            onDragOver={ ( e ) => onDragOver( e, tier ) }
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
            <button onClick={ handleSave } className="mt-5 p-2 bg-slate-800 hover:bg-slate-600 hover:cursor-pointer items-center rounded border border-slate-700">Save Tierlist</button>
        </div>
    )
}