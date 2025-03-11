"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Button } from "@/components/ui/button";
import { CardSlider } from "@/components/form-create/card-slider";
import { CardLongText } from "@/components/form-create/card-long-text";
import { TitleCard } from "@/components/form-create/card-title";
import { DockDemo } from "@/components/form-create/dock";
import { CardShortText } from "@/components/form-create/card-short-text";
import { CommandDialogDemo } from "@/components/form-create/command";
import { v4 as uuidv4 } from "uuid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Plus, Save } from "lucide-react";

export interface Field {
  id: string;
  type: string;
  title: string;
}

export default function Page() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [saveFields, setSaveFields] = useState<Field[]>([]);
  const [fieldsEdited, setFieldsEdited] = useState(false);
  const [username, setUsername] = useState<string>(localStorage.getItem("username") || "Utilisateur");

  const handleAddField = (type: Field["type"]) => {
    const newField: Field = {
      id: uuidv4(),
      type,
      title,
    };

    setFields((prev) => [...prev, newField]);
    setIsCommandOpen(false);
  };

  const checkFields = (fields: Field[]) => {
    for (const field of fields) {
      if (!field.title || field.title == "") {
        toast("Champ invalide", {
          description: "Veuillez ajouter un titre à chaque champ",
        });
        setFieldsEdited(false);
        return false;
      }
    }

    if (fields.length === 0) {
      toast("Formulaire vide", {
        description: "Vous ne pouvez pas sauvegarder un formulaire vide",
      });
      setFieldsEdited(false);
      return false;
    }

    if (fields === saveFields) {
      toast("Formulaire déjà sauvegardé", {
        description: "Vous avez déjà sauvegardé ce formulaire",
      });
      setFieldsEdited(false);
      return false;
    } else {
      setFieldsEdited(true);
    }

    return true;
  }

  const handleSaveForm = async () => {
    try {
      console.log("Sauvegarde du formulaire...");

      if (!checkFields(fields)) {
        return;
      }
    
      // Adjust the payload to match the backend's expected structure
      const payload = {
        userId: username,  // Set the user ID here
        title: title,
        description: description,   // Same for description
        questions: fields.map((field) => {
          // Map fields to match the expected format for the backend
          const question: any = {
            id: field.id,
            type: field.type,
            title: field.title,
          };
  
          if (field.type === "slider") {
            question.sliderMin = field.sliderMin;
            question.sliderMax = field.sliderMax;
            question.sliderStep = field.sliderStep;
          }
  
          return question;
        }),
      };
  
      console.log(payload);

      const response = await fetch("http://localhost:3000/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      console.log("Formulaire sauvegardé:", result);
      setSaveFields(fields);
      setFieldsEdited(false);
      toast("Formulaire sauvegardé", {
        description: "Vous avez sauvegardé votre formulaire avec succès",
      });
    } catch (error) {
      console.error("Erreur de sauvegarde", error);
      toast("Une erreur est survenue", {
        description: "Impossible de sauvegarder le formulaire",
      });
    }
  };  

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id));
  };

  const data = {
    navbar: [
      {
        href: "#",
        onclick: () => setIsCommandOpen(true),
        icon: Plus,
        label: "Ajouter un champ",
      },
      {
        href: "#",
        onclick: () => handleSaveForm(),
        icon: Save,
        disabled: !fieldsEdited,
        label: "Sauvegarder",
      },
    ],
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">Ynov</BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">NoSQL</BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                Formulaire
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Création de formulaire</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button
            onClick={handleSaveForm}
            className="ml-auto"
            disabled={!fieldsEdited}
          >
            <Save className="mr-2" /> Sauvegarder
          </Button>
        </header>

        <div className="flex justify-center w-full">
          <div className="flex flex-1 flex-col gap-4 items-center w-80 py-10">
            <TitleCard 
              onChange={(key, value) => {
                if ( key === "title" ) {
                  setTitle(value);
                } else if ( key === "description" ) {
                  setDescription(value);
                }
              }
            }
            />
            {fields.map((field) => {
              if (field.type === "slider") {
                return (
                  <CardSlider
                    key={field.id}
                    field={field}
                    onDelete={() => handleDeleteField(field.id)}
                    onChange={(key, value) => {
                      checkFields(fields);
                      setFields((prevFields) =>
                        prevFields.map((f) =>
                          f.id === field.id ? { ...f, [key]: value } : f
                        )
                      );
                    }}
                  />
                );
              } else if (field.type === "longText") {
                return (
                  <CardLongText
                    key={field.id}
                    field={field}
                    onDelete={() => handleDeleteField(field.id)}
                    onChange={(key, value) => {
                      checkFields(fields);
                      setFields((prevFields) =>
                        prevFields.map((f) =>
                          f.id === field.id ? { ...f, [key]: value } : f
                        )
                      );
                    }}
                  />
                );
              } else if (field.type === "shortText") {
                return (
                  <CardShortText
                    key={field.id}
                    field={field}
                    onDelete={() => handleDeleteField(field.id)}
                    onChange={(key, value) => {
                      checkFields(fields);
                      setFields((prevFields) =>
                        prevFields.map((f) =>
                          f.id === field.id ? { ...f, [key]: value } : f
                        )
                      );
                    }}
                  />
                );
              }
              return null;
            })}

            <CommandDialogDemo
              open={isCommandOpen}
              onOpenChange={setIsCommandOpen}
              onSelectField={handleAddField}
            />
            <DockDemo data={data} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
