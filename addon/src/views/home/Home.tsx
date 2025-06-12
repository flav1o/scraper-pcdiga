import { MainWrapper, ProductsComboBox } from "@/components";
import fox from "../../assets/lotties/fox.json";
import { GET_PRODUCTS_LITE } from "@/graphql";
import { useQuery } from "@apollo/client";
import Lottie from "lottie-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ProductsOnWatch } from "./components/ProductsOnWatch";

export const HomeView = () => {
  const [term, setTerm] = useState("");
  const { t } = useTranslation();

  const {
    data: searchBarProducts,
    refetch: refetchSearchBarProducts,
  } = useQuery(GET_PRODUCTS_LITE, {
    skip: !term,
    variables: { term: "" },
    onCompleted: (data) => console.log("Query completed", data),
  });

  const onProductSearchHandler = (_term: string) => {
    setTerm(_term);
    refetchSearchBarProducts({ term: _term });
  };

  return (
    <MainWrapper className="px-5" width="350px">
      <div className="py-4 h-full">
        <ProductsComboBox
          products={searchBarProducts?.productsLite}
          onEdit={onProductSearchHandler}
          term={term}
        />
        <div className="flex justify-between items-end mb-5">
          <h1 className="font-bold text-lg">{t("home.on_watch")}</h1>
          <Lottie animationData={fox} className="w-10 scale-x-[-1]" />
        </div>
        <ProductsOnWatch />
      </div>
    </MainWrapper>
  );
};
