"use client";

import React, { useEffect, useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TitleCard } from "@/components/form-search/card-title";
import { CardForm } from "@/components/form-search/card-form";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { clear } from "console";

export default function Page() {
  const [title, setTitle] = useState("");
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);
  
  async function fetchForms() {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/forms?title=${title}`);
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des formulaires", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      fetchForms();
    }, 1000);

    setTimeoutId(newTimeoutId);
  }, [title]);

  async function deleteForm(id) {
    try {
      await fetch(`http://localhost:8080/forms/${id}`, { method: "DELETE" });
      setForms((prevForms) => prevForms.filter((form) => form._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du formulaire", error);
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
            <TitleCard
              onChange={(key, value) => {
                if (key === "title") {
                  setTitle(value);
                }
              }}
              callback={(action) => {
                if (action === "search") {
                  fetchForms();
                }
              }}
            />
            {loading && <Skeleton className="h-52 w-10/12 rounded-xl" />}
            {!loading && forms.length === 0 && <p>Aucun formulaire trouvé.</p>}
            {forms.map((form) => (
              <CardForm
                key={form._id}
                id={form._id}
                title={form.title}
                description={form.description}
                user={form.userId}
                callback={(id, action) => {
                  if (action === "delete") {
                    deleteForm(id);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}