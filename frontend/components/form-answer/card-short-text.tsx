import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import HeaderCard from "./card-header";
import { Label } from "@/components/ui/label";
import { TextCursorInput } from "lucide-react";
import { Field } from "@/app/form-create/page";

interface CardShortTextProps {
  field: Field;
  answer?: string;
  onAnswerChange?: (value: string) => void;
  readOnly?: boolean;
}

export function CardShortText({ field, answer, onAnswerChange, readOnly = false }: CardShortTextProps) {
  return (
    <div className="w-10/12">
      <Card>
        <HeaderCard title={field.title} icon={<TextCursorInput />} />
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor={`${field.id}-answer`}>Réponse</Label>
              <Input
                id={`${field.id}-answer`}
                value={answer || ""}
                onChange={(e) => onAnswerChange?.(e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}