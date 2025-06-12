import { Button } from "@/components";
import { Input } from "@/components/ui/input";
import { SignUpFormProps } from "./SignUp.types";
import styled from "styled-components";

export const SignUpForm = ({
  handleSubmit,
  register,
  onSubmit,
  isValid,
  isLoading,
  errors,
}: SignUpFormProps) => {
  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <Input
        className="mb-2"
        id="email"
        placeholder="Email"
        type="email"
        {...register("email", { required: true })}
      />
      <Input
        className="mb-2"
        placeholder="Username"
        type="username"
        {...register("username", { required: true })}
      />
      <Input
        className="mb-2"
        placeholder="Password"
        type="password"
        {...register("password", { required: true })}
      />
      <Input
        className="mb-6"
        placeholder="Repetir Password"
        type="password"
        {...register("repeatPassword", { required: true })}
      />
      <Button
        type="submit"
        size="sm"
        disabled={!isValid && !isLoading}
        isLoading={isLoading}
      >
        Criar Conta
      </Button>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;
