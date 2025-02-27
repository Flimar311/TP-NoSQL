import { ReactNode } from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface HeaderProps {
  title: string;
  icon: ReactNode;
  onDelete?: () => void;
}

const HeaderCard: React.FC<HeaderProps> = ({ title, icon, onDelete }) => {
  return (
    <CardHeader className="flex flex-row justify-between">
      <div className="flex flex-row gap-2 space-y-0 items-center">
        {icon}
        <CardTitle>{title}</CardTitle>
      </div>
      { onDelete && (
        <div>
            <Button
            variant="outline"
            size="icon"
            className="rounded-full text-red-600 hover:bg-red-100 hover:text-red-800"
            onClick={onDelete}
            >
            <Trash2 />
            </Button>
        </div>
    )}
    </CardHeader>
  );
};

export default HeaderCard;
