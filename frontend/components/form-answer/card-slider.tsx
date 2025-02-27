import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import HeaderCard from "./card-header";

interface CardSliderProps {
  field: {
    id: string;
    title: string;
    sliderMin: number;
    sliderMax: number;
    sliderStep: number;
  };
  answer?: number;
  onAnswerChange: (value: number) => void;
  readOnly?: boolean;
}

export function CardSlider({ field, answer = field.sliderMin, onAnswerChange, readOnly = false }: CardSliderProps) {
  return (
    <div className="w-10/12">
      <Card>
        <HeaderCard title={field.title} icon={<SlidersHorizontal />} />
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Réponse</Label>
              <Slider
                value={[answer]}
                min={field.sliderMin}
                max={field.sliderMax}
                step={field.sliderStep}
                disabled={readOnly}
                onValueChange={(value) => onAnswerChange(value[0])}
              />
              <div className="text-center text-sm font-medium">{answer}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
