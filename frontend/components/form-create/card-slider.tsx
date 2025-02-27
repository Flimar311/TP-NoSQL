import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/app/form-create/page";
import HeaderCard from "./card-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { SlidersHorizontal, TestTubeDiagonal } from "lucide-react";

interface CardSliderProps extends React.ComponentPropsWithoutRef<"div"> {
  field: Field;
  onDelete?: () => void;
  onChange?: (key: string, value: string) => void;
}

export function CardSlider({ field, onDelete, onChange, className, ...props }: CardSliderProps) {
  const [sliderTitle, setSliderTitle] = React.useState(field.sliderTitle || "Sélecteur");
  const [sliderMin, setSliderMin] = React.useState(field.sliderMin || 0);
  const [sliderMax, setSliderMax] = React.useState(field.sliderMax || 1);
  const [sliderStep, setSliderStep] = React.useState(field.sliderStep || 1);
  const [sliderValue, setSliderValue] = React.useState(0);
  const [sliderDisabled, setSliderDisabled] = React.useState(true);

  field.sliderMin = sliderMin;
  field.sliderMax = sliderMax;
  field.sliderStep = sliderStep;
  field.title = sliderTitle;

  return (
    <div className="w-10/12">
      <Card>
        {onDelete ? (
          <HeaderCard title="Sélecteur" icon={<SlidersHorizontal />} onDelete={onDelete} />
        ) : (
          <HeaderCard title="Sélecteur" icon={<SlidersHorizontal />} />
        )}

        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor={`name-${field.id}`}>Question</Label>
                <Input id={`name-${field.id}`} value={sliderTitle} 
                onChange={(e) => {
                  setSliderTitle(e.target.value);
                  onChange?.("title", e.target.value);
                }} />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label>Paramètres</Label>
                <div className="grid grid-cols-4 gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor={`sliderMin-${field.id}`} className="font-extralight">
                      Nombre minimum
                    </Label>
                    <Input
                      id={`sliderMin-${field.id}`}
                      placeholder="Nombre minimum"
                      type="number"
                      value={sliderMin}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setSliderMin(value);
                        onChange?.("sliderMin", value.toString());
                      }}
                    />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor={`sliderMax-${field.id}`} className="font-extralight">
                      Nombre maximum
                    </Label>
                    <Input
                      id={`sliderMax-${field.id}`}
                      placeholder="Nombre maximum"
                      type="number"
                      value={sliderMax}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setSliderMax(value);
                        onChange?.("sliderMax", value.toString());
                      }}
                    />
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor={`sliderStep-${field.id}`} className="font-extralight">
                      Step
                    </Label>
                    <Input
                      id={`sliderStep-${field.id}`}
                      placeholder="Step"
                      type="number"
                      value={sliderStep}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setSliderStep(value);
                        onChange?.("sliderStep", value.toString());
                      }}
                    />
                  </div>

                  <div className="flex items-end">
                    <Toggle
                      variant="outline"
                      className="w-full"
                      onClick={() => setSliderDisabled(!sliderDisabled)}
                      aria-label="Toggle"
                    >
                      <TestTubeDiagonal />
                      Tester le sélecteur
                    </Toggle>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor={`slider-${field.id}`}>Réponse</Label>
                <Slider
                  value={[sliderValue]}
                  min={sliderMin}
                  max={sliderMax}
                  step={sliderStep}
                  disabled={sliderDisabled}
                  onValueChange={(value) => {
                    setSliderValue(value[0]);
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
