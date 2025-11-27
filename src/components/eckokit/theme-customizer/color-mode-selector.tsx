"use client";

import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "next-themes";
import { SetStateAction } from "react";

export function ColorModeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor="roundedCorner">Color mode:</Label>
      <ToggleGroup
        value={theme}
        type="single"
        onValueChange={(value: SetStateAction<string>) => setTheme(value)}
      >
        <ToggleGroupItem variant="outline" value="light">
          Light
        </ToggleGroupItem>
        <ToggleGroupItem
          variant="outline"
          value="dark"
          className="data-[variant=outline]:border-l-1"
        >
          Dark
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
