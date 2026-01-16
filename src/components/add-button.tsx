import { Plus } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AddButton = ({
  children,
  className,
  ...props
}: ComponentProps<typeof Button>) => {
  return (
    <Button className={cn(className)} {...props}>
      <Plus className="mr-2 size-4" />
      {children ?? "Add"}
    </Button>
  );
};
