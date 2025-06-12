import {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

export type SignInFormInputs = {
  email: string;
  password: string;
};

export interface SignInFormProps {
  register: UseFormRegister<SignInFormInputs>;
  handleSubmit: UseFormHandleSubmit<SignInFormInputs, undefined>;
  onSubmit: SubmitHandler<SignInFormInputs>;
  isValid: boolean;
  isLoading: boolean;
}
