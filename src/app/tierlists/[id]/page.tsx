import { createServerSupabaseClient } from '@/lib/supabase'
import { TierList, TierWithEntries } from '@/types/database'
import { redirect } from 'next/navigation'
import TierListEditor from '@/components/tierlisteditor'


type Props = {
  params: Promise<{ id: string }>
}


export default async function TierListPage( { params }: Props ) {
    const { id } = await params
    const client = await createServerSupabaseClient()

    const { data: tierlistData } = await client
        .from( 'tierlist' )
        .select( '*' )
        .eq( 'id', id )
        .single()
    const tierlist = tierlistData as TierList | null
    
    if (!tierlist) redirect( "/tierlists" )

    const { data: tiersData } = await client
        .from('tier')
        .select('*, tierentry(*)')
        .eq('tierlist_id', id)
        .order('rank')

    const tiers = tiersData as TierWithEntries[] | null

    return (
        <TierListEditor 
            tierlist={ tierlist }
            tiers={ tiers ?? [] }
        />
    )
}