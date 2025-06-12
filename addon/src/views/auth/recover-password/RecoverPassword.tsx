import { Button } from "@/components";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { RecoverPasswordFormInputs } from "./RecoverPassword.types";
import { useNavigate } from "react-router-dom";
import { Routes } from "@/constants";

const yupValidationSchema = yup.object().shape({
  email: yup.string().email().required(),
});

export const RecoverPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<RecoverPasswordFormInputs>({
    resolver: yupResolver(yupValidationSchema),
  });

  const onSubmit: SubmitHandler<RecoverPasswordFormInputs> = (data) => {
    console.log("data", data);
    navigate({
      pathname: Routes.ConfirmationCode,
      search: `?email=flavio@gmail.com`,
    });
  };

  return (
    <form
      className="flex flex-1 flex-col justify-center gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input placeholder="Email" {...register("email", { required: true })} />
      <Button type="submit" size="sm" disabled={!isValid}>
        Confirmar
      </Button>
    </form>
  );
};
