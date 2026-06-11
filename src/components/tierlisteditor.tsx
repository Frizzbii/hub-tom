'use client'


import { TierList, TierWithEntries } from '@/types/database'


type Props = {
    tierlist: TierList
    tiers: TierWithEntries[]
}


export default function TierListEditor( { tierlist, tiers } : Props ) {
    return(
        <>
            <h1>{ tierlist.name }</h1>
            <div>
                {(tiers ?? []).map(tier => (
                    <div key={tier.id}>
                        {tier.label}
                    </div>
                ))}
            </div>
        </>
    )
}