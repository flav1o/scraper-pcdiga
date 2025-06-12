import {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

export type RecoverPasswordFormInputs = {
  email: string;
};

export interface RecoverPasswordFormProps {
  register: UseFormRegister<RecoverPasswordFormInputs>;
  handleSubmit: UseFormHandleSubmit<RecoverPasswordFormInputs, undefined>;
  onSubmit: SubmitHandler<RecoverPasswordFormInputs>;
  isValid: boolean;
}
