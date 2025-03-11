// components/form-search/card-title.js
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardTitleProps extends React.ComponentPropsWithoutRef<"div"> {
  onChange?: (key: string, value: string) => void;
  callback?: (action: string) => void;
}

export function TitleCard({ onChange, callback, ...props }: CardTitleProps) {
  return (
    <div className="w-10/12 mb-8">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <FileSearch />
            <CardTitle>Recherche de Réponses</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              callback?.("search");
            }}
          >
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="searchQuery">Rechercher</Label>
                <Input
                  id="searchQuery"
                  onChange={(e) => onChange?.("searchQuery", e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="searchField">Champ de recherche</Label>
                <select
                  id="searchField"
                  onChange={(e) => onChange?.("searchField", e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="id">ID</option>
                  <option value="title">Titre</option>
                  <option value="user">Utilisateur</option>
                </select>
              </div>
              <Button type="submit" variant="outline">
                Rechercher
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
