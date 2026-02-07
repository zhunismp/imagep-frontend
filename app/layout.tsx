import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import type { ReactNode } from "react";
import Providers from "./providers";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {/* Header */}
        <header className="flex-shrink-0 border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group min-w-0">
              <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold group-hover:scale-105 transition">
                IP
              </div>
              <div className="text-sm font-semibold group-hover:underline truncate">
                Imagep
              </div>
            </Link>

            <div className="hidden sm:flex flex-wrap items-center justify-end gap-2 text-xs text-slate-500">
              <span className="px-3 py-1 rounded-full bg-slate-100 border whitespace-nowrap">
                JPG / PNG
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 border whitespace-nowrap">
                Drag & Drop
              </span>
            </div>
          </div>
        </header>

        {/* Main: fill remaining space (NO centering here) */}
        <Providers>
          <main className="flex-1 flex">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
              {children}
            </div>
          </main>
          <Toaster />
        </Providers>

        {/* Footer */}
        <footer className="flex-shrink-0 border-t border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid gap-10 md:grid-cols-12">
              {/* Left */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                    IP
                  </div>
                  <div className="font-semibold text-slate-900">Imagep</div>
                </div>

                <p className="text-slate-500 max-w-2xl">
                  Open-source image compression pipeline built for speed and privacy.
                  Compress JPG & PNG instantly in your browser.
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  {["MIT License", "Open Source", "Community Driven"].map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full bg-slate-100 border text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right */}
              <div className="md:col-span-5 flex md:justify-end">
                <div className="w-full md:w-auto space-y-3">
                  <a
                    href="https://github.com/YOUR_USERNAME/YOUR_REPO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border bg-slate-50 hover:bg-slate-100 transition font-medium text-slate-900"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 008 10.95c.6.1.82-.25.82-.56v-2.17c-3.25.7-3.93-1.56-3.93-1.56-.53-1.35-1.3-1.7-1.3-1.7-1.06-.73.08-.71.08-.71 1.18.08 1.8 1.2 1.8 1.2 1.05 1.8 2.76 1.28 3.43.98.1-.76.4-1.28.72-1.57-2.6-.3-5.33-1.3-5.33-5.8 0-1.28.46-2.32 1.2-3.14-.12-.3-.52-1.52.12-3.18 0 0 .98-.31 3.2 1.2a11.1 11.1 0 015.82 0c2.22-1.51 3.2-1.2 3.2-1.2.64 1.66.24 2.88.12 3.18.75.82 1.2 1.86 1.2 3.14 0 4.52-2.73 5.5-5.33 5.8.42.36.78 1.08.78 2.18v3.23c0 .31.22.66.83.56A11.5 11.5 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
                    </svg>
                    View on GitHub
                  </a>

                  <p className="text-xs text-slate-400">
                    © {new Date().getFullYear()} Imagep — built in the open.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-1 bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600" />
        </footer>
      </body>
    </html>
  );
}