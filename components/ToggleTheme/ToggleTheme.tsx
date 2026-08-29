import { useTheme } from "next-themes";
import { Button } from "@/components/Button/Button";
import { Moon } from "lucide-react";
import { Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function ToggleTheme({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // True only after client hydration. Using useSyncExternalStore (server
  // snapshot = false, client = true) avoids the SSR/client icon mismatch
  // without a setState-in-effect mount guard.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <Button variant="icon" disabled={true} aria-hidden="true" className={className}>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }
  return (
    <Button
      variant="icon"
      className={className}
      onClick={() => {
        setTheme(theme == "dark" ? "light" : "dark");
      }}
    >
      {theme == "dark" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}

export default ToggleTheme;
