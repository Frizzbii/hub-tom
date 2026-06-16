import { createServerSupabaseClient } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'
import { notFound, redirect } from 'next/navigation'
import TierListEditor from '@/components/tierlisteditor'


type Props = {
  params: Promise<{ id: string }>
}


export default async function TierListPage( { params }: Props ) {
    const { id } = await params

    const { userId } = await auth()
    if (!userId) {
        redirect('/sign-in')
    }

    const client = await createServerSupabaseClient()

    const { data: tierlist, error: tierListError } = await client
        .from('tierlist')
        .select('*')
        .eq('id', id)
        .single()

    if (tierListError || !tierlist) {
        return notFound()
    }

    const { data: tiers, error: tiersError } = await client
        .from('tier')
        .select(`
            id,
            label,
            rank,
            tierentry (
                position,
                game:game!game_id (
                    id,
                    name,
                    imageUrl
                )
            )
        `)
        .eq('tierlist_id', id)
        .order('rank', { ascending: true })
    
    console.log("--- DEBUGGING TIERS FETCH ---")
console.log("Looking for tierlist_id:", id)
console.log("Raw Tiers Data:", tiers)
console.log("Database Error (if any):", tiersError)
console.log("-----------------------------")

    if (tiersError || !tiers) {
        return <div className="p-10 text-red-500">Error loading tiers.</div>
    }

    return (
        <TierListEditor 
            tierlist={tierlist} 
            tiers={tiers as any} 
        />
    )
}