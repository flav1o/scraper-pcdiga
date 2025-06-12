import { ProductInfoCard } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_PRODUCTS_ON_WATCH } from "@/graphql";
import { useQuery } from "@apollo/client";
import { List } from "react-virtualized";

const CardSkeleton = () => {
  return <Skeleton className="h-[10vh] mb-2" />;
};

export const ProductsOnWatch = () => {
  const { data: onWatch, loading } = useQuery(GET_PRODUCTS_ON_WATCH, {
    onCompleted: (data) => console.log("Query completed", data),
    onError: (error) => console.log("Query error", error),
  });

  const products = onWatch?.myWatchList || [];

  if (loading) {
    return (
      <div className="flex flex-col">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const rowRenderer = ({ index, key, style }) => {
    const { product, prices } = products[index];

    return (
      <div key={key} style={style} id={product?.productId}>
        <ProductInfoCard prices={prices} {...product} />
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 h-[100%] overflow-y-auto pb-2">
      <List
        autoHeight
        width={310}
        rowCount={products.length}
        height={Math.min(products.length * 75, window.innerHeight * 0.7)}
        rowHeight={75}
        rowRenderer={rowRenderer}
        overscanRowCount={5}
        containerStyle={{
          overflow: "visible",
        }}
        style={{
          overflow: "visible",
        }}
      />
    </div>
  );
};
