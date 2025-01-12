"use client"

import * as React from "react"
import {
  TextCursorInput,
  WrapText,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export function CommandDialogDemo({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <>
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Rechercher un block" />
        <CommandList>
          <CommandEmpty>Aucun résultat</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <WrapText />
              <span>Texte long</span>
            </CommandItem>
            <CommandItem>
              <TextCursorInput />
              <span>Texte court</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
