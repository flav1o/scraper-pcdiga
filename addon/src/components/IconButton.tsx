import { ReactElement } from "react";
import { Button } from "./ui/button";
import { IconType } from "react-icons/lib";

type Props = {
  icon: ReactElement<IconType>;
  onClick: () => void;
  text: string
};

export const IconButton = ({ icon, text, onClick }: Props) => {
  return (
    <Button onClick={onClick} size="sm">
      {text}{" "}{icon}
    </Button>
  );
};
