import React from "react";
import Link from "next/link";
import { RotateCcw, Heart, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-900 dark:text-white"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span>
                Give<span className="text-emerald-600 dark:text-emerald-400">Loop</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering communities and university students to reduce waste by giving
              functional clothes, textbooks, laptops, and furniture a meaningful second life.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Row Level Security Protected
              </span>
              <span>•</span>
              <span>100% Free & Community-Driven</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/?category=Laptops" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Laptops & Tech
                </Link>
              </li>
              <li>
                <Link href="/?category=Textbooks" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Used Textbooks
                </Link>
              </li>
              <li>
                <Link href="/?category=Furniture" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Study Furniture
                </Link>
              </li>
              <li>
                <Link href="/?category=Clothes" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Clothes & Winterwear
                </Link>
              </li>
            </ul>
          </div>

          {/* Student / Portfolio Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3">
              About Project
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              B.Tech CS&IT Capstone Project built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>for circular economy</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} GiveLoop. Built for education and open community donation.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:underline">Browse</Link>
            <Link href="/donate" className="hover:underline">Donate</Link>
            <Link href="/login" className="hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
