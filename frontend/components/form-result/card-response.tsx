// components/form-search/card-response.js
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { json } from "stream/consumers";

function getAvatarFallback(username: string): string {
  if (!username) return "??";
  return username.slice(0, 2).toUpperCase();
}

interface CardResponseProps extends React.ComponentPropsWithoutRef<"div"> {
  id: string;
  name: string;
  description: string;
  user: string;
  answers: { question: string; answer: string }[];
  callback?: (id: string, action: string) => void;
}

export function CardResponse({
  id,
  name,
  description,
  user,
  answers,
  callback,
  ...props
}: CardResponseProps) {
  console.log("Réponse : ", { user });
  
  return (
    <div className="w-10/12 relative">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 items-center">
            <CardTitle>{name}</CardTitle>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Avatar>
              <AvatarImage src="" alt={"@" + user} />
              <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <Label>Description : {description}</Label>
          <div className="mt-4">
            {answers &&
              answers.map((answer, index) => (
                <div key={index} className="mb-2 border p-2 rounded">
                  <p className="font-bold">Question : {answer.questionTitle}</p>
                  <p>Réponse : {answer.answer}</p>
                </div>
              ))}
          </div>
          <div className="flex gap-1 mt-4">
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Suppression de la réponse</DrawerTitle>
                    <DrawerDescription>
                      Êtes-vous sûr de vouloir supprimer cette réponse ?
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button
                      variant="destructive"
                      onClick={() => callback && callback(id, "delete")}
                    >
                      Supprimer
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Annuler</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
