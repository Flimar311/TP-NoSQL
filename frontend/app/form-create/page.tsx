"use client";

import React, { useState } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Button } from "@/components/ui/button"
import { CardLongText } from "@/components/form-create/card-long-text"
import { DockDemo } from "@/components/form-create/dock"
import { CardShortText } from "@/components/form-create/card-short-text"
import { CommandDialogDemo } from "@/components/form-create/command"
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

export default function Page() {
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  const data = {
    navbar: [
      {
        href: "#",
        onclick: () => setIsCommandOpen(true),
        icon: Plus,
        label: "Home",
      },
      {
        href: "#",
        onclick: "",
        icon: Save,
        label: "Blog",
      },
    ],
  };

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
                <BreadcrumbItem className="hidden md:block">
                  Ynov
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  NoSQL
                </BreadcrumbItem>
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
          </div>
        </header>
        <div className="flex justicy-center w-full">
          <div className="flex flex-1 flex-col gap-4 items-center w-80 py-10">
          <CardLongText />
          <CardShortText />
          <CommandDialogDemo open={isCommandOpen} onOpenChange={setIsCommandOpen} />
          {/* <Button variant="outline" className="rounded-full" size="icon" onClick={() => setIsCommandOpen(true)} >
            <Plus />
          </Button> */}
          <DockDemo data={data} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
