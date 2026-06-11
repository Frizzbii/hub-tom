import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server"


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!


// Public client
export const supabase = createClient( supabaseUrl, supabaseAnonKey )


// Authenticated server-side client
export async function createServerSupabaseClient() {
  const { getToken } = await auth()
  return createClient( supabaseUrl, supabaseAnonKey, { accessToken : async () => (await getToken()) ?? '' } )
}