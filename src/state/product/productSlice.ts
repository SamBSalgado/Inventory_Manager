import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

 export interface Product {
  id?: number,
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
  metrics: Metrics[];
}

const initialState: productsState = {
  products: [],
  filters: {name: "", category: [], availability: ""},
  loading: false,
  error: null,
  metrics: [],
};

export interface Metrics {
  category: string;
  totalProducts: number;
  totalStockUnits: number;
  totalStockValue: number;
  avgPrice: number;
}

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
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        console.log("Product CREATED.");
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = true;
        state.error = action.error.message || "Error al crear el producto.";
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.error = null;
        console.log("Producto MODIFICADO.");
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al modificar el producto.";
      })
      .addCase(getMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.metrics = action.payload;
      })
      .addCase(getMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: Product) => {
    const response = await fetch('http://localhost:9090/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Error al crear el producto.");
    }
    return await response.json();
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (productData: Product) => {
    const response = await fetch(`http://localhost:9090/products/${productData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Error al modificar el producto.");
    }
    return await response.json();
  }
);

export const getMetrics = createAsyncThunk(
  'products/getMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:9090/products/metrics');
      if (!response.ok) {
        throw new Error("Error al obtener las métricas.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const { setFilters } = productsSlice.actions;
export default productsSlice.reducer;