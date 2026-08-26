"use client";

import { useState } from "react";
import { VariantSelector } from "./VariantSelector";
import { ProductActions } from "./ProductActions";

interface Variant {
  name: string;
  color: string;
}

interface ProductInfoProps {
  title: string;
  price: string;
  variants: Variant[];
}

export function ProductInfo({ title, price, variants }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);

  return (
    <>
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
    </>
  );
}
