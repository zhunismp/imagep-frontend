import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import type { ReactNode } from "react";
import Providers from "./providers";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden bg-slate-50 text-slate-900 flex flex-col">
        <Providers>
          {/* Header */}
          <header className="h-16 flex-shrink-0 border-b border-slate-200 bg-white flex items-center px-4">
            <div className="mx-auto w-full max-w-7xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold group-hover:scale-105 transition">
                    IC
                  </div>
                  <div className="text-sm font-semibold group-hover:underline">
                    Image Compressor
                  </div>
                </Link>
              </div>

              <div className="hidden sm:flex gap-2 text-xs text-slate-500">
                <span className="px-3 py-1 rounded-full bg-slate-100 border">
                  JPG / PNG
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 border">
                  Drag & Drop
                </span>
              </div>
            </div>
          </header>

          {/* Main — fills remaining height */}
          <main className="flex-1 flex items-center justify-center px-4 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              {children}
            </div>
          </main>
          <Toaster />

          {/* Footer */}
          <footer className="h-14 flex-shrink-0 border-t border-slate-200 bg-white flex items-center justify-center text-sm text-slate-500">
            © {new Date().getFullYear()} Image Compressor
          </footer>
        </Providers>
      </body>
    </html>
  );
}
