import * as React from "react"
 
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  WrapText,
} from "lucide-react"

export function CardLongText({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className="w-10/12">
      <Card>
      <CardHeader className="flex flex-row gap-2 space-y-0 items-center">
        <WrapText />
        <CardTitle>Texte Long</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Question</Label>
              <Input id="name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Réponse</Label>
              <Textarea disabled />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}
