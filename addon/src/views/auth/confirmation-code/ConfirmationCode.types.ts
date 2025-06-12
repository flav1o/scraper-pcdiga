import {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

export type ConfirmationCodeFormInputs = {
  code: string;
};

export interface ConfirmationCodeFormProps {
  register: UseFormRegister<ConfirmationCodeFormInputs>;
  handleSubmit: UseFormHandleSubmit<ConfirmationCodeFormInputs, undefined>;
  onSubmit: SubmitHandler<ConfirmationCodeFormInputs>;
  isValid: boolean;
}
