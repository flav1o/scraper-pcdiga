import { useForm, SubmitHandler } from "react-hook-form";

import { SignUpForm } from "./SignUpForm";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUpFormInputs } from "./SignUp.types";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/constants";
import { useMutation } from "@apollo/client";
import { SIGN_UP } from "@/graphql";
import { ERRORS } from "@/graphql/error-messages";
import { toast } from "sonner";
import { Trans, useTranslation } from "react-i18next";
import { MainWrapper } from "@/components";

const yupValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  username: yup.string().required(),
  password: yup.string().required(),
  repeatPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")]),
});

export const SignUpView = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setError,
  } = useForm<SignUpFormInputs>({
    resolver: yupResolver(yupValidationSchema),
  });

  const [signUp, { loading }] = useMutation(SIGN_UP, {
    onError: (error) => {
      if (error.message === ERRORS.DUPED_EMAIL) {
        setError("email", { message: ERRORS.DUPED_EMAIL });
        toast.error(t(error.message));
      }
    },
    onCompleted: () => {
      toast.success("Conta criada com sucesso!");
      navigate(Routes.SignIn, {
        replace: true,
      });
    },
  });

  const onSubmit: SubmitHandler<SignUpFormInputs> = ({
    email,
    password,
    username,
  }) => {
    signUp({
      variables: {
        input: {
          email,
          username,
          password,
        },
      },
    });
  };

  return (
    <MainWrapper className="px-5" width="300px">
      <div className="flex flex-col flex-1 pt-6">
        <div>
          <h1 className="text-2xl font-bold mb-6">
            <Trans i18nKey="auth.signup_title" components={{ br: <br /> }} />
          </h1>
          <SignUpForm
            isValid={isValid}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={loading}
            errors={errors}
          />
        </div>
        <a
          className="text-xs cursor-pointer mt-auto mx-auto mb-3 text-gray-300 select-none"
          onClick={() =>
            navigate(Routes.SignIn, {
              replace: true,
            })
          }
        >
          {t("auth.has_account")}
        </a>
      </div>
    </MainWrapper>
  );
};
