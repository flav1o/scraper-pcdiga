import { useForm, SubmitHandler } from "react-hook-form";

import { SignInForm } from "./SignInForm";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaGoogle } from "react-icons/fa";
import { Button, MainWrapper } from "@/components";
import { SignInFormInputs } from "./SignIn.types";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { SIGN_IN } from "@/graphql/mutations/sign-in";
import { ERRORS } from "@/graphql/error-messages";
import { useStorage } from "@/hooks";
import { Trans, useTranslation } from "react-i18next";
import { useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_AUTH } from "@/graphql";
import { useAppDispatch } from "@/store";
import { setAuthToken } from "@/store/slices/user-slice";

const yupValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required(),
});

export const SignInView = () => {
  const navigate = useNavigate();
  const { setKey } = useStorage();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { isValid },
    setError,
  } = useForm<SignInFormInputs>({
    resolver: yupResolver(yupValidationSchema),
  });

  const onSuccessfulSignIn = (authToken: string) => {
    dispatch(setAuthToken(authToken));
    setKey("AUTH_TOKEN", authToken);
    toast.success("Sucesso! A redirecionar...");
    navigate(Routes.Home, { replace: true });
  };

  const [googleAuth, { loading: gAuthLoading }] = useMutation(GOOGLE_AUTH, {
    onCompleted: ({ googleAuth: { authToken } }) =>
      onSuccessfulSignIn(authToken),
  });

  const [signIn, { loading: localAuthLoading }] = useMutation(SIGN_IN, {
    onError: (error) => {
      if (error.message === ERRORS.INVALID_SIGN_IN) {
        setError("root", { message: ERRORS.INVALID_SIGN_IN });
        toast.error(error.message);
      }
    },
    onCompleted: ({ signIn: { authToken } }) => onSuccessfulSignIn(authToken),
  });

  const onSubmit: SubmitHandler<SignInFormInputs> = async (formData) => {
    await signIn({
      variables: {
        input: formData,
      },
    });
  };

  const googleLoginHandler = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
    onSuccess: async (data) => {
      await googleAuth({
        variables: {
          code: data.code,
        },
      });
    },
  });

  const isLoading = localAuthLoading || gAuthLoading;

  return (
    <MainWrapper className="px-5" width="300px">
      <div className="flex flex-col flex-1 pt-6">
        <div>
          <h1 className="text-2xl font-bold mb-6">
            <Trans i18nKey="auth.signin_title" components={{ br: <br /> }} />
          </h1>
          <SignInForm
            isValid={isValid}
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
          <section id="social-login" className="flex justify-center mt-6">
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-transparent"
                  onClick={() => googleLoginHandler()}
                >
                  <FaGoogle />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Google</p>
              </TooltipContent>
            </Tooltip>
          </section>
        </div>
        <a
          className="text-xs cursor-pointer mt-auto mx-auto mb-3 text-gray-300 select-none"
          onClick={() => navigate(Routes.SignUp, { replace: true })}
        >
          {t("auth.create_account")}
        </a>
      </div>
    </MainWrapper>
  );
};
