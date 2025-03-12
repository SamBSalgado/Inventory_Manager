import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: number,
  name: string,
  category: string,
  quantityInStock: number,
  unitPrice: number,
  expirationDate?: string
}

interface productsState {
  products: Product[];
  filters: {
    name: string;
    category: string[];
    availability: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: productsState = {
  products: [],
  filters: {name: "", category: [], availability: ""},
  loading: false,
  error: null
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<{ name?: string; category?: string[]; availability?: string }>) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
        console.log("fetch finished.")
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("getting products is PENDING...");
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error desconocido.";
      });
  }
});

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters: { name?: string; category?: string[]; availability?: string }) => {
    const queryParams = new URLSearchParams();

    if (filters.name) {
      queryParams.append("name", filters.name);
    }
    if (filters.category && filters.category.length > 0) {
      queryParams.append("category", filters.category.join(','));
    }
    if (filters.availability) {
      queryParams.append("availability", filters.availability);
    }

    const response = await fetch(`http://localhost:9090/products?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }
    return await response.json();
  }
);

export const { setFilters } = productsSlice.actions;
export default productsSlice.reducer;