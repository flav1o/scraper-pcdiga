import React, { ImgHTMLAttributes, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import FakeImage from "/public/fake-image.jpg";

type LazyImageProps = {
  alt: string;
} & ImgHTMLAttributes<HTMLImageElement>;

export const LazyImage = ({ className, alt, ...props }: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <div className="relative">
      {isLoading && (
        <Skeleton className={`absolute w-[100%] h-[100%] ${className}`} />
      )}
      <img
        {...props}
        src={props.src}
        className={className}
        loading="lazy"
        alt={alt}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};
