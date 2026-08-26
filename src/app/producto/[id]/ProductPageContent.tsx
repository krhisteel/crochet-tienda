"use client";

import { useState } from "react";
import { ImageGallery } from "@/components/ImageGallery";
import { VariantSelector } from "./VariantSelector";
import { ProductActions } from "./ProductActions";

interface Variant {
  name: string;
  color: string;
  image?: string;
}

interface ProductPageContentProps {
  title: string;
  price: string;
  mainImage: string | null;
  images: string | null;
  variants: Variant[];
}

export function ProductPageContent({ title, price, mainImage, images, variants }: ProductPageContentProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
      <div>
        <ImageGallery
          mainImage={mainImage}
          images={images}
          title={title}
          variants={variants}
          selectedVariant={selectedVariant}
        />
      </div>

      <div className="flex flex-col">
        {variants.length > 0 && (
          <div className="mb-6">
            <VariantSelector
              variants={variants}
              selected={selectedVariant}
              onSelect={setSelectedVariant}
            />
          </div>
        )}

        <ProductActions
          title={title}
          price={price}
          variant={variants.length > 0 ? variants[selectedVariant]?.name : undefined}
        />
      </div>
    </div>
  );
}
