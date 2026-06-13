'use client'

import { useState, useEffect } from 'react'
import { Game } from '@/types/game'

export default function GameSearch() {
    const [search, setSearch] = useState('')
    const [games, setGames] = useState<Game[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (search === '') {
            setGames([])
            return
        }

        async function fetchGames() {
            setLoading(true)
            const res = await fetch(`/api/rawg?search=${encodeURIComponent(search)}`)
            const data = await res.json()
            setGames(data)
            setLoading(false)
        }

        fetchGames()
    }, [search])

    return (
        <div className="mt-6">
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a game..."
                className="w-full px-4 py-2 rounded bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:border-blue-500"
            />

            { loading && <p className="text-slate-400 text-sm mt-3">Searching...</p> }

            <div className="flex flex-wrap gap-2 mt-3">
                { games.map(game => (
                    <div
                        key={game.id}
                        draggable onDragStart={ ( e ) => {
                            e.dataTransfer.setData( 'id', game.id.toString() )
                            e.dataTransfer.setData('name', game.name)
                            e.dataTransfer.setData('imageUrl', game.imageUrl ?? '')
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
                ))}
            </div>
        </div>
    )
}