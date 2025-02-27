"use client";

import Link from "next/link";
import React from "react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "@/components/ui/dock";

export type IconProps = React.HTMLAttributes<SVGElement>;

export function DockDemo({
  data,
}: {
  data: {
    navbar: {
      href: string;
      onclick?: () => void;
      icon: React.ElementType;
      disabled?: boolean;
      label: string;
    }[];
  };
}) {
  return (
    <div>
      <TooltipProvider>
        <Dock direction="middle">
          {data.navbar
            .filter((item) => !item.disabled) // Filter out disabled items
            .map((item) => (
              <DockIcon key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        item.onclick && item.onclick();
                      }}
                      aria-label={item.label}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-12 rounded-full"
                      )}
                    >
                      <item.icon className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            ))}
        </Dock>
      </TooltipProvider>
    </div>
  );
}
