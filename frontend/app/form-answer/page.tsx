"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Button } from "@/components/ui/button";
import { CardSlider } from "@/components/form-answer/card-slider";
import { CardLongText } from "@/components/form-answer/card-long-text";
import { CardShortText } from "@/components/form-answer/card-short-text";
import { TitleCard } from "@/components/form-answer/card-title";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Save } from "lucide-react";

export default function AnswerFormPage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("id");

  const [formData, setFormData] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [username, setUsername] = useState<string>(localStorage.getItem("username") || "Utilisateur");

  useEffect(() => {
    if (!formId) {
      toast("ID de formulaire manquant", {
        description: "Aucun identifiant de formulaire fourni dans l'URL",
      });
      return;
    }

    // Récupération des données du formulaire.
    // ATTENTION : L'endpoint GET doit être adapté pour retourner le formulaire par son ID.
    http://localhost:3000/forms?formId=67b88067db7f1696b9c81845
    fetch(`http://localhost:3000/forms?formId=${formId}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      if (data.length === 0) {
        toast("Formulaire introuvable", {
          description: "Aucun formulaire trouvé avec cet ID",
        });
      } else {
        setFormData(data[0]); // On prend le premier résultat (si trouvé)
      }
    })
    .catch((err) => {
      toast("Erreur lors du chargement du formulaire", {
        description: err.message,
      });
    });
  }, [formId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitAnswers = async () => {
    if (!formId) return;

    if (!formData || !formData.questions || formData.questions.length === 0) {
      toast("Formulaire vide", {
        description: "Aucun champ à répondre",
      });
      return;
    }

    console.log("Utilisateur:", username);
    

    // Création du payload des réponses
    const payload = {
      user: username,
      answers: formData.questions.map((question: any) => ({
        questionId: question.id,
        answer: answers[question.id] || "",
      })),
    };

    try {
      const response = await fetch(`http://localhost:3000/forms/${formId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission");
      }

      const result = await response.json();
      toast("Réponses envoyées", {
        description: "Merci pour votre participation",
      });
    } catch (error: any) {
      console.error(error);
      toast("Une erreur est survenue", {
        description: error.message,
      });
    }
  };

  if (!formData) {
    return <div>Chargement...</div>;
  }

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
              <BreadcrumbItem className="hidden md:block">Formulaire</BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Répondre au formulaire</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button onClick={handleSubmitAnswers} className="ml-auto">
            <Save className="mr-2" /> Envoyer les réponses
          </Button>
        </header>
        <div className="flex justify-center w-full">
          <div className="flex flex-1 flex-col gap-4 items-center w-80 py-10">
            {/* Affichage du titre et de la description en mode lecture seule */}
            <TitleCard 
              title={formData.title} 
              description={formData.description} 
              readOnly={true} // Ajoutez cette prop dans TitleCard pour le mode "réponse"
            />
            {formData.questions.map((question: any) => {
              if (question.type === "slider") {
                return (
                  <CardSlider
                    key={question.id}
                    field={question}
                    answer={answers[question.id] || ""}
                    onAnswerChange={(value: string) => handleAnswerChange(question.id, value)}
                    readOnly={false} // En réponse, on ne modifie pas le contenu du champ
                  />
                );
              } else if (question.type === "longText") {
                return (
                  <CardLongText
                    key={question.id}
                    field={question}
                    answer={answers[question.id] || ""}
                    onAnswerChange={(value: string) => handleAnswerChange(question.id, value)}
                    readOnly={false}
                  />
                );
              } else if (question.type === "shortText") {
                return (
                  <CardShortText
                    key={question.id}
                    field={question}
                    answer={answers[question.id] || ""}
                    onAnswerChange={(value: string) => handleAnswerChange(question.id, value)}
                    readOnly={false}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
