import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import HeaderCard from "./card-header";
import { Label } from "@/components/ui/label";
import { FileSearch, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CardTitleProps extends React.ComponentPropsWithoutRef<"div"> {
  onChange?: (key: string, value: string) => void;
  callback?: (action: string) => void;
}

export function TitleCard({ onChange, callback, className, ...props }: CardTitleProps) {
  return (
    <div className="w-10/12 mb-8">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 space-y-0 items-center">
            <FileSearch />
            <CardTitle>Recherche de Formulaire</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
             e.preventDefault()
             callback?.("search")
            }}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Nom du formulaire</Label>
                <Input id="title" onChange={(e) => onChange?.("title", e.target.value)} />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
