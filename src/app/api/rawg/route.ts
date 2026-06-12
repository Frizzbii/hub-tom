import { NextRequest, NextResponse } from 'next/server'
import { Game, RawgGame } from '@/types/game'

export async function GET( req: NextRequest ) {
    const search = req.nextUrl.searchParams.get('search')

    if ( !search ) {
        return NextResponse.json( { error: 'Missing search param' }, { status: 400 } )
    }

    const res = await fetch( `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&search=${encodeURIComponent(search)}&page_size=16` )

    if ( !res.ok ) return NextResponse.json( { error: 'RAWG request failed' }, { status: 500 } )

    const data = await res.json()

    const games : Game[] = data.results.map( ( game : RawgGame ) => ({
        id : game.id,
        name : game.name,
        imageUrl : game.background_image
    }))
    
    return NextResponse.json( games )
}