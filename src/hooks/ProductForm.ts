import { useState } from "react";
import { Product } from "../../src/state/product/productSlice";

interface Props {
  initialData?: Product;
  categories: string[];
  onCategoryNewSelected?: () => void;
}

export function useProductForm({ 
  initialData,
  categories,
  onCategoryNewSelected,
}: Props) {
  const [formData, setFormData] = useState<Product>(
    initialData ?? {
      id: 0,
      name: "",
      category: categories.length > 0 ? categories[0]: "",
      quantityInStock: 0,
      unitPrice: 0,
      expirationDate: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "category" && value === "new") {
      onCategoryNewSelected?.();
    }
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantityInStock" || name === "unitPrice"
          ? Number(value)
          : value,
    }));
  };

  return { formData, handleChange, setFormData };
};
