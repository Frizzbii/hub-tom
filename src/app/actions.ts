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
                position: index 
            })
        })
    }

    if (entriesToInsert.length > 0) {
        await client
            .from('tierentry')
            .insert(entriesToInsert)
    }
}