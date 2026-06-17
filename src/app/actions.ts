'use server'

import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { TierEntry, TierList } from "@/types/database"
import { LocalTier } from '@/components/tierlisteditor'

export async function saveTierList( tierlist : TierList, localTiers : LocalTier[] ) {
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')
    
    const client = await createServerSupabaseClient()
    
    await client
        .from('tierlist')
        .delete()
        .in('id', [ tierlist.id ])

    await client
        .from( 'tierlist' )
        .insert( { id : tierlist.id, user_id : tierlist.user_id, name : tierlist.name } )
    
    const entriesToInsert : any[] = []

    for (const tier of localTiers) {
        await client
            .from('tier')
            .insert({ 
                id: tier.id, 
                tierlist_id: tierlist.id, 
                label: tier.label, 
                rank: tier.rank
            })

        tier.games.forEach((game, index) => {
            entriesToInsert.push({ 
                tier_id: tier.id, 
                game_id: game.id, 
                position: index,
                name: game.name,
                image_url: game.imageUrl
            })
        })
    }

    if (entriesToInsert.length > 0) {
        await client
            .from('tierentry')
            .insert(entriesToInsert)
    }
}

export async function createTierList( formData : FormData ) {

    const name = formData.get( 'name' ) as string
    const client = await createServerSupabaseClient()
    const { userId } = await auth()
    if (!userId) redirect('/sign-in')

    const { data : tierlist } = await client
        .from( 'tierlist' )
        .insert( { name, user_id : userId } )
        .select()
        .single()
    
    if (!tierlist) redirect( '/tierlists' )
    const id = tierlist.id

    await client
        .from( 'tier' )
        .insert([
            { tierlist_id: id, label: 'S', rank: 1 },
            { tierlist_id: id, label: 'A', rank: 2 },
            { tierlist_id: id, label: 'B', rank: 3 },
            { tierlist_id: id, label: 'C', rank: 4 },
            { tierlist_id: id, label: 'D', rank: 5 },
        ])

    redirect( '/tierlists' )
}