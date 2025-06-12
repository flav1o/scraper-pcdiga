import { Button } from "@/components";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ConfirmationCodeFormInputs } from "./ConfirmationCode.types";

const yupValidationSchema = yup.object().shape({
  code: yup.string().length(6).required(),
});

export const ConfirmationCode = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<ConfirmationCodeFormInputs>({
    resolver: yupResolver(yupValidationSchema),
  });

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log("data", data);
  };

  return (
    <form
      className="flex flex-1 flex-col items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
      {...register("code", { required: true })}
    >
      <div>
        <p className="text-sm">Enviámos um código para o seu email.</p>
      </div>
      <InputOTP maxLength={6} name="code" className="w-full">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div />
    </form>
  );
};
