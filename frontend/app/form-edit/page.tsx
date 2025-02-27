"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Button } from "@/components/ui/button";
import { CardSlider } from "@/components/form-edit/card-slider";
import { CardLongText } from "@/components/form-edit/card-long-text";
import { TitleCard } from "@/components/form-edit/card-title";
import { DockDemo } from "@/components/form-edit/dock";
import { CardShortText } from "@/components/form-edit/card-short-text";
import { CommandDialogDemo } from "@/components/form-edit/command";
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
  // Pour slider, vous pouvez ajouter :
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
}

export default function Page() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("id");

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [saveFields, setSaveFields] = useState<Field[]>([]);
  const [fieldsEdited, setFieldsEdited] = useState(false);
  const [username, setUsername] = useState<string>(localStorage.getItem("username") || "Utilisateur");

  // Si formId est présent, on charge le formulaire existant
  useEffect(() => {
    if (formId) {
      fetch(`http://localhost:8080/forms?formId=${formId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const form = data[0];
            setTitle(form.title);
            setDescription(form.description || "");
            setFields(form.questions || []);
            setSaveFields(form.questions || []);
          } else {
            toast("Formulaire non trouvé", {
              description: "Aucun formulaire trouvé avec cet ID",
            });
          }
        })
        .catch((err) => {
          console.error("Erreur lors du chargement du formulaire", err);
          toast("Erreur", {
            description: "Impossible de charger le formulaire",
          });
        });
    }
  }, [formId]);

  const handleAddField = (type: Field["type"]) => {
    const newField: Field = {
      id: uuidv4(),
      type,
      title : "",
    };

    setFields((prev) => [...prev, newField]);
    setIsCommandOpen(false);
  };

  const checkFields = (fields: Field[]) => {
    for (const field of fields) {
      if (!field.title || field.title === "") {
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

    if (JSON.stringify(fields) === JSON.stringify(saveFields)) {
      toast("Formulaire déjà sauvegardé", {
        description: "Vous avez déjà sauvegardé ce formulaire",
      });
      setFieldsEdited(false);
      return false;
    } else {
      setFieldsEdited(true);
    }

    return true;
  };

  const handleSaveForm = async () => {
    try {
      console.log("Sauvegarde du formulaire...");

      if (!checkFields(fields)) {
        return;
      }

      // Préparer le payload attendu par le backend
      const payload = {
        userId: username, // à adapter selon votre logique d'authentification
        title: title,
        description: description,
        questions: fields.map((field) => {
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

      let response;
      if (formId) {
        // Mode modification : on utilise la méthode PUT
        response = await fetch(`http://localhost:8080/forms/${formId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Mode création : on utilise la méthode POST
        response = await fetch("http://localhost:8080/forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();
      console.log("Formulaire sauvegardé:", result);
      setSaveFields(fields);
      setFieldsEdited(false);
      toast("Formulaire sauvegardé", {
        description: "Votre formulaire a été sauvegardé avec succès",
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
                <BreadcrumbPage>
                  {formId ? "Modification du formulaire" : "Création de formulaire"}
                </BreadcrumbPage>
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
            <TitleCard title={title} description={description}
              onChange={(key, value) => {
                if (key === "title") {
                  setTitle(value);
                } else if (key === "description") {
                  setDescription(value);
                }
              }}
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
