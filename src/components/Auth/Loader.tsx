// src/components/Auth/Loader.tsx
export default function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <span className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
      {text}
    </span>
  );
}
