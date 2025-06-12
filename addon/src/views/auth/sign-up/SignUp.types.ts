import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

export type SignUpFormInputs = {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
};

export interface SignUpFormProps {
  register: UseFormRegister<SignUpFormInputs>;
  handleSubmit: UseFormHandleSubmit<SignUpFormInputs, undefined>;
  onSubmit: SubmitHandler<SignUpFormInputs>;
  isValid: boolean;
  isLoading: boolean;
  errors: FieldErrors<SignUpFormInputs>;
}
