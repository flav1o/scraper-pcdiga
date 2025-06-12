import { Button } from "@/components";
import { Input } from "@/components/ui/input";
import { SignInFormProps } from "./SignIn.types";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/constants";
import { useTranslation } from "react-i18next";

export const SignInForm = ({
  handleSubmit,
  register,
  onSubmit,
  isValid,
  isLoading,
}: SignInFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <Input
        className="mb-2"
        placeholder="Email"
        type="email"
        {...register("email", { required: true })}
      />
      <Input
        className="mb-2"
        placeholder="Password"
        type="password"
        {...register("password", { required: true })}
      />
      <div className="flex justify-end mb-6">
        <a
          className="text-xs text-blue-500 cursor-pointer"
          onClick={() =>
            navigate(Routes.RecoverPassword, {
              replace: true,
            })
          }
        >
          {t("auth.forgot_password")}
        </a>
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={!isValid && !isLoading}
        isLoading={isLoading}
      >
        {t("auth.signin")}
      </Button>
    </StyledForm>
  );
};

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;
