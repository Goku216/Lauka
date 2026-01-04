"use client";

import { useState } from "react";
import { ICON_MAP, IconName } from "@/extras/icon-map";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export interface IconDropdownProps {
    selectedIcon: IconName | null;
    setSelectedIcon: (icon: IconName) => void;
}

export default function IconDropdown({ selectedIcon, setSelectedIcon }: IconDropdownProps) {
  const [open, setOpen] = useState(false);
  

  const SelectedIcon = selectedIcon ? ICON_MAP[selectedIcon] : null;

  return (
    <div className="relative w-full space-y-2">
      {/* Trigger */}
      <Label>Icon</Label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-fit items-center justify-between rounded border px-3 py-2"
      >
        {SelectedIcon ? (
          <div className="flex items-center gap-2">
            <SelectedIcon className="w-8 h-8" />
            
          </div>
        ) : (
          <span className="text-muted-foreground">Select icon</span>
        )}
        <ChevronDown className="w-4 h-4 opacity-60" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-[18%] overflow-auto rounded border bg-background shadow">
          {Object.entries(ICON_MAP).map(([name, Icon]) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                setSelectedIcon(name as IconName);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-accent",
                selectedIcon === name && "bg-accent"
              )}
            >
              <Icon className="w-8 h-8" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
