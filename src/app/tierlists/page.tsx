import { createServerSupabaseClient } from '@/lib/supabase'
import { TierList } from '@/types/database'
import Link from "next/link"
import { createTierList } from '@/app/actions'


export default async function TierListsPage() {
    const client = await createServerSupabaseClient()
    const { data } = await client.from( 'tierlist' ).select( '*' ).overrideTypes<TierList[]>()
    const tierlists = data as TierList[] | null

    return (
        <div className="max-w-5xl mx-auto px-6 py-20">

            {/* Header */}
            <header className="mb-16">
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    My Tier Lists
                </h1>
                <p className="text-slate-400 mt-4 text-lg">
                    Create and manage your video game tier lists.
                </p>
            </header>

            {/* Create form */}
            <form action={createTierList} className="flex gap-3 mb-12">
                <input
                    name="name"
                    placeholder="New tier list name..."
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors cursor-pointer"
                >
                    Create
                </button>
            </form>

            {/* Tier lists */}
            { (tierlists ?? []).length === 0
                ? <p className="text-slate-500">No tier lists yet. Create one above.</p>
                : (
                    <div className="grid gap-4 md:grid-cols-2">
                        { (tierlists ?? []).map(tierlist => (
                            <Link
                                key={tierlist.id}
                                href={`/tierlists/${tierlist.id}`}
                                className="group p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all duration-300"
                            >
                                <h2 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                                    { tierlist.name }
                                </h2>
                                <p className="text-slate-500 text-sm mt-1">
                                    Click to edit
                                </p>
                            </Link>
                        ))}
                    </div>
                )
            }
        </div>
    )
}