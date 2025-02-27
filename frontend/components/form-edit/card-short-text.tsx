import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import HeaderCard from "./card-header";
import { Label } from "@/components/ui/label";
import { TextCursorInput, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/app/form-create/page";
import { loremIpsum } from 'react-lorem-ipsum';

interface CardShortTextProps extends React.ComponentPropsWithoutRef<"div"> {
  field: Field;
  onDelete?: () => void;
  onChange?: (key: string, value: string) => void;
}

export function CardShortText({
  field,
  onDelete,
  onChange, 
  className,
  ...props
}: CardShortTextProps) {
  console.log(field);

  return (
    <div className="w-10/12">
      <Card>
        {onDelete && (
          <HeaderCard title="Texte Court" icon={<TextCursorInput />} onDelete={onDelete} />
        )}
        { !onDelete && (
          <HeaderCard title="Texte Court" icon={<TextCursorInput />} />
        )}
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Question</Label>
                <Input id="name" placeholder="Titre de la question" onChange={(e) => onChange?.("title", e.target.value)} value={field.title} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Réponse</Label>
                <Input value={loremIpsum({ p: 1, avgSentencesPerParagraph: 2 })} disabled />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
