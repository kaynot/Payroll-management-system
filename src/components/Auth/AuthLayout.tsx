// src/components/Auth/AuthLayout.tsx
import type { ReactNode } from "react";
import BackgroundEffects from "./BackgroundEffects";
import { Card } from "../ui/card";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <BackgroundEffects />

      <Card className="w-full max-w-md relative z-10 border shadow-2xl backdrop-blur-sm bg-card/95 animate-fade-in">
        {children}
      </Card>
    </div>
  );
}
