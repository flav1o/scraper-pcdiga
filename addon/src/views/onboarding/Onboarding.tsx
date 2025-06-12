import { Button, MainWrapper } from "@/components";
import { useStorage } from "@/hooks";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import fox from "../../assets/lotties/fox.json";
import { useTranslation } from "react-i18next";

export const OnboardingView = () => {
  const { setKey } = useStorage();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const selectedLang = i18n.language;

  const onProceedClick = () => {
    setKey("ONBOARDING", true);
    navigate("/auth/signin", {
      replace: true,
    });
  };

  return (
    <MainWrapper className="px-5">
      <div className="flex flex-col flex-1 gap-2 justify-end pb-5">
        <Lottie
          animationData={fox}
          className="w-10 absolute top-3 left-3"
          onClick={() =>
            i18n.changeLanguage(selectedLang === "pt" ? "en" : "pt")
          }
        />
        <h1 className="text-2xl font-bold">{t("onboarding.title")}</h1>
        <span className="font-light pb-6">{t("onboarding.description")}</span>
        <Button className="w-full" size="sm" onClick={onProceedClick}>
          {t("onboarding.button")}
        </Button>
      </div>
    </MainWrapper>
  );
};
