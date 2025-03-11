// app/responses/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TitleCard } from "@/components/form-result/card-title";
import { CardResponse } from "@/components/form-result/card-response";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";

interface FormType {
  _id: string;
  title: string;
  description?: string;
  questions: {
    id: string;
    type: string;
    title: string;
    sliderMin?: number;
    sliderMax?: number;
    sliderStep?: number;
  }[];
}

interface AnswerType {
  questionId: string;
  answer: any;
  questionTitle?: string;
}

interface ResponseType {
  _id: string;
  formId: string;
  name?: string;
  description?: string;
  user?: string;
  answers: AnswerType[];
  respondedAt: string;
}

export default function ResponsesPage() {
  const searchParams = useSearchParams();
  const formIdFromUrl = searchParams.get("formId"); // Si présent, on affiche uniquement les réponses du formulaire

  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("id");
  const [responses, setResponses] = useState<ResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  // formsMap stocke les infos des formulaires déjà récupérées, indexées par leur id
  const [formsMap, setFormsMap] = useState<{ [key: string]: FormType }>({});
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Fonction pour récupérer les réponses
  async function fetchResponses() {
    setLoading(true);
    try {
      let url = "";
      if (formIdFromUrl) {
        url = `http://localhost:3000/forms/${formIdFromUrl}/responses`;
      } else {
        url = `http://localhost:3000/responses?searchField=${searchField}&searchQuery=${searchQuery}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      console.log("Réponses récupérées : ", data);
      
      setResponses(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des réponses", error);
    } finally {
      setLoading(false);
    }
  }

  // Fonction pour récupérer les infos d'un formulaire par son id
  async function fetchForm(formId: string): Promise<FormType | null> {
    try {
      const res = await fetch(`http://localhost:3000/forms?formId=${formId}`);
      const data = await res.json();
      if (data && data.length > 0) {
        return data[0];
      }
      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération du formulaire", error);
      return null;
    }
  }

  // Si formId est présent, on récupère directement les infos du formulaire associé
  useEffect(() => {
    if (formIdFromUrl) {
      fetchForm(formIdFromUrl).then((form) => {
        if (form) {
          setFormsMap((prev) => ({ ...prev, [formIdFromUrl]: form }));
        }
      });
      // On récupère aussi les réponses du formulaire
      fetchResponses();
    }
  }, [formIdFromUrl]);

  // Pour le cas sans formId dans l'url, on déclenche le fetch avec timeout sur searchQuery et searchField
  useEffect(() => {
    if (!formIdFromUrl) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const newTimeoutId = setTimeout(() => {
        fetchResponses();
      }, 1000);
      setTimeoutId(newTimeoutId);
    }
  }, [searchQuery, searchField, formIdFromUrl]);

  // Dès que les réponses sont récupérées, on vérifie pour chaque réponse si nous avons déjà les infos du formulaire associé.
  // Si non, on les récupère et on met à jour notre cache (formsMap)
  useEffect(() => {
    async function updateFormsInfo() {
      const formIdsToFetch = responses
        .map((resp) => resp.formId)
        .filter((formId) => !formsMap[formId]); // uniquement les formId non déjà présents
      if (formIdsToFetch.length > 0) {
        const promises = formIdsToFetch.map((fid) => fetchForm(fid));
        const forms = await Promise.all(promises);
        const newForms: { [key: string]: FormType } = {};
        forms.forEach((form) => {
          if (form) {
            newForms[form._id] = form;
          }
        });
        setFormsMap((prev) => ({ ...prev, ...newForms }));
      }
    }
    if (responses.length > 0) {
      updateFormsInfo();
    }
  }, [responses, formsMap]);

  async function deleteResponse(id: string) {
    try {
      await fetch(`http://localhost:3000/responses/${id}`, {
        method: "DELETE",
      });
      setResponses((prev) => prev.filter((resp) => resp._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la réponse", error);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
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
                  <BreadcrumbPage>Recherche de formulaire</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex justify-center w-full">
          <div className="flex flex-1 flex-col gap-4 items-center w-80 py-10">
            {/* Afficher la zone de recherche seulement si formId n'est pas fourni */}
            {/* {!formIdFromUrl && (
              <TitleCard
                onChange={(key, value) => {
                  if (key === "searchQuery") {
                    setSearchQuery(value);
                  } else if (key === "searchField") {
                    setSearchField(value);
                  }
                }}
                callback={(action) => {
                  if (action === "search") {
                    fetchResponses();
                  }
                }}
              />
            )} */}
            {loading && <Skeleton className="h-52 w-10/12 rounded-xl" />}
            {!loading && responses.length === 0 && (
              <p>Aucune réponse trouvée.</p>
            )}
            {responses.map((resp: ResponseType) => {
              // Récupération des infos du formulaire associé
              const formInfo = formsMap[resp.formId];
              // Pour chaque réponse, on ajoute le titre de la question s'il est disponible dans formInfo
              const answersWithTitles = resp.answers.map((ans) => {
                const question =
                  formInfo?.questions.find((q) => q.id === ans.questionId) || null;
                return {
                  ...ans,
                  questionTitle: question ? question.title : "Question inconnue",
                };
              });
              return (
                <CardResponse
                  key={resp._id}
                  id={resp._id}
                  // On utilise le titre et la description du formulaire si disponibles
                  name={formInfo?.title || resp.name || "Réponse"}
                  description={formInfo?.description || resp.description || ""}
                  user={resp.user || "Inconnu"}
                  answers={answersWithTitles}
                  callback={(id, action) => {
                    if (action === "delete") {
                      deleteResponse(id);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
