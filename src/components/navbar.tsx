import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 border-b border-slate-800 bg-black text-white">
        <Link href="/" className="font-bold">Tom's apps</Link>

        <div className="flex items-center gap-4">
            <Show when="signed-out">
                <SignInButton>
                    <button className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign In
                </button>
                </SignInButton>
                <SignUpButton>
                    <button className="bg-gradient-to-r from-purple-600 to-purple-400 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign Up
                    </button>
                </SignUpButton>
            </Show>
            <Show when="signed-in">
                <UserButton />
            </Show>
      </div>
    </nav>
  )
}