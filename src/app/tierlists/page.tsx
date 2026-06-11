import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { TierList } from '@/types/database'
import Link from "next/link"


export default async function TierListsPage() {
    const client = await createServerSupabaseClient()
    const { data } = await client.from( 'tierlist' ).select( '*' ).overrideTypes<TierList[]>()
    const tierlists = data as TierList[] | null

    return (
        <>
            <div>
            <h1>My Tier Lists</h1>
            </div>

            <form action = { createTierList }>
                <input name="name" />
                <button type="submit">Create</button>
            </form>

            <div>
                {(tierlists ?? []).map(tierlist => (
                    <Link key={tierlist.id} href={`/tierlists/${tierlist.id}`}>
                        {tierlist.name}
                    </Link>
                ))}
            </div>
        </>
    )
}


async function createTierList( formData : FormData ) {
    'use server'

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