"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeaderCard from "./card-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSliders, FilePenLine, Trash2, FileSearch } from "lucide-react";
import { Field } from "@/app/form-create/page";
import { loremIpsum } from "react-lorem-ipsum";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface CardFormProps extends React.ComponentPropsWithoutRef<"div"> {
  id: string;
  title: string;
  description: string;
  user: string;
  callback?: (id: string, action: string) => void;
  badge?: string;
}

function getAvatarFallback(username: string): string {
  if (!username) return "??"; // Fallback si aucun pseudo n'est fourni
  return username.slice(0, 2).toUpperCase();
}

export function CardForm({
  id,
  title,
  description,
  user,
  callback,
  badge,
  ...props
}: CardFormProps) {
  return (
    <div className="w-10/12 relative">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-row gap-2 space-y-0 items-center">
            <FileSearch />
            <CardTitle>{title}</CardTitle>
          </div>
          <div className="flex flex-row gap-2 space-y-0 items-center">
            {/* <BadgeCheck fill="#ffc62d" className="dark:text-black text-white" size={35} /> */}
            <Avatar>
              <AvatarImage src="" alt={"@" + user} />
              <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <Label>Description : {description}</Label>
          <br />
          <br />
          <div className="flex gap-1">
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "form-answer?id=" + id;
              }}
            >
              < FilePenLine />
              Répondre au formulaire
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.location.href = "form-edit?id=" + id;
              }}
            >
              <FileSliders /> Editer
            </Button>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Suppression du formulaire</DrawerTitle>
                    <DrawerDescription>
                      Êtes-vous sûr de vouloir supprimer ce formulaire ?
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button
                      variant="destructive"
                      onClick={() => callback(id, "delete")}
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
