import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import HeaderCard from "./card-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WrapText } from "lucide-react";
import { Field } from "@/app/form-create/page";
import { loremIpsum } from 'react-lorem-ipsum';

interface CardLongTextProps extends React.ComponentPropsWithoutRef<"div"> {
  field: Field;
  onDelete?: () => void;
  onChange?: (key: string, value: string) => void;
}

export function CardLongText({ field, onDelete, onChange, className, ...props }: CardLongTextProps) {
  console.log(field);
  
  return (
    <div className="w-10/12 relative">
      <Card>
        {onDelete && (
          <HeaderCard title="Texte Long" icon={<WrapText />} onDelete={onDelete} />
        )}
        { !onDelete && (
          <HeaderCard title="Texte Long" icon={<WrapText />} />
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
                <Textarea value={loremIpsum({ p: 1, avgSentencesPerParagraph: 5 })} disabled />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
