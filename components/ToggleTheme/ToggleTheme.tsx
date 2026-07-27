import { useTheme } from "next-themes";
import { Button } from "@/components/Button/Button";
import { Moon } from "lucide-react";
import { Sun } from "lucide-react";
import { useEffect, useState } from "react";

function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="icon" disabled={true} aria-hidden="true">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }
  return (
    <Button
      variant="icon"
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
