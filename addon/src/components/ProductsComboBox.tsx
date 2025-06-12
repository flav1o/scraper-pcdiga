import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "./ui/input";
import { ChangeEvent, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { LazyImage } from "./LazyImage";
import { useTranslation } from "react-i18next";
import { useClickOutside } from "@/hooks/useClickOutside";
import { addEllipsis } from "@/common";
import List from "react-virtualized/dist/commonjs/List";
import { useNavigate } from "react-router-dom";

interface ProductSearchProps {
  products: { name: string; productId: string; image: string }[];
  onEdit: (term: string) => void;
  term: string;
}

export const ProductsComboBox = ({ products, onEdit }: ProductSearchProps) => {
  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useClickOutside(dropdownContainerRef, () => onEdit(""));
  const { t } = useTranslation();
  const { debounce } = useDebounce();

  const onEditHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onEdit(e.target.value);
  };

  const rowRenderer = ({ index, key, style }) => {
    const product = products[index];

    return (
      <div key={key} style={style} id={product.productId}>
        <ComboBoxItem
          content={product.name}
          image={product.image}
          onClick={() => navigate(`/product-details/${product.productId}`)}
        />
        {index !== products.length - 1 && (
          <div className="h-[1px] bg-gray-900 w-full my-1" />
        )}
      </div>
    );
  };

  return (
    <div className="relative" ref={componentRef}>
      <Input
        className="mb-4"
        placeholder={t("home.search")}
        onChange={(e) => debounce(() => onEditHandler(e), 300)}
      />
      {!!products?.length && (
        <Card
          ref={dropdownContainerRef}
          className="absolute w-[100%] overflow-y-auto z-50 py-1 px-2"
          style={{ transitionDuration: "1s" }}
        >
          <CardContent className="px-1 pt-2">
            <List
              width={280}
              height={Math.min(products.length * 70, window.innerHeight * 0.7)}
              rowHeight={70}
              rowCount={products.length}
              rowRenderer={rowRenderer}
              overscanRowCount={0}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ComboBoxItem = ({
  content,
  image,
  onClick,
}: {
  content: string;
  image: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex items-center gap-1 mb-2 cursor-pointer hover:bg-gray-900 rounded py-2 px-2"
      onClick={onClick}
    >
      <LazyImage
        alt="product"
        src={image}
        className="w-[40px] h-[40px] rounded-sm object-contain"
      />
      <p className="py-2 pl-3 text-xs">{addEllipsis(content, 30)}</p>
    </div>
  );
};
