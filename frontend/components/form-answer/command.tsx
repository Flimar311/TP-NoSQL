"use client"

import * as React from "react"
import {
  SlidersHorizontal,
  TextCursorInput,
  WrapText,
} from "lucide-react"
import { Field } from "@/app/form-create/types"
import { v4 as uuidv4 } from "uuid";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function CommandDialogDemo({
  open,
  onOpenChange,
  onSelectField,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectField: (field: Field["type"]) => void;
}) {
  return (
    <>
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput placeholder="Rechercher un champ" />
        <CommandList>
          <CommandEmpty>Aucun résultat</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() => onSelectField("longText")}
              className="cursor-pointer"
            >
              <WrapText />
              <span>Texte long</span>
            </CommandItem>
            <CommandItem
              onSelect={() => onSelectField("shortText")}
              className="cursor-pointer"
            >
              <TextCursorInput />
              <span>Texte court</span>
            </CommandItem>
            <CommandItem
              onSelect={() => onSelectField("slider")}
              className="cursor-pointer"
            >
              <SlidersHorizontal />
              <span>Sélecteur</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
