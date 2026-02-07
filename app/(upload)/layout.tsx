import type { ReactNode } from "react";

export default function UploadLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex-1 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        {children}
      </div>
    </div>
  );
}