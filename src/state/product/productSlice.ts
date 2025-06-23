import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

 export interface Product {
  id: number,
  name: string,
  category: string,
  quantityInStock: number,
  unitPrice: number,
  expirationDate?: string
}

interface productsState {
  products: Product[];
  categories: string[];
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
  categories: [],
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
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error desconocido.";
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al obtener las categorías.";
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = true;
        state.error = action.payload || "Error al crear el producto.";
      })
      .addCase(setProductInStock.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.products.findIndex((product: Product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(setProductInStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setProductInStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al actualizar el stock a 10.";
      })
      .addCase(setProductOutOfStock.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.error = null;
        const index = state.products.findIndex((product: Product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(setProductOutOfStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setProductOutOfStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al actualizar el stock a 0.";
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al modificar el producto.";
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
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.error = null;
        state.loading = false;
        state.products = state.products.filter(product => product.id !== action.payload);
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al eliinar el producto.";
      });
  }
});

export const fetchCategories = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
  >(
    "products/fetchCategories",
    async (_, { rejectWithValue }) => {
      const response = await fetch("http://localhost:9090/products/categories");
      if (!response.ok) {
        return rejectWithValue("Error al obtener categorías");
      }
      return await response.json();
    }
  );

export const fetchProducts = createAsyncThunk<
  Product[],
  { name?: string; category?: string[]; availability?: string },
  { rejectValue: string }
  >(
    "products/fetchProducts",
    async (filters, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
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
        return rejectWithValue("Error al obtener productos");
      }
      return await response.json();
    }
  );

export const setProductInStock = createAsyncThunk<
Product,
number,
{ rejectValue: string }
>(
  "products/setProductInStock",
  async (productId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const response = await fetch(`http://localhost:9090/products/${productId}/instock`, {
      method: 'PUT',
    });
    if (!response.ok) {
      return rejectWithValue("Error al actualizar el stock.");
    }
    return await response.json();
  }
);

export const setProductOutOfStock = createAsyncThunk<
Product,
number,
{ rejectValue: string }
>(
  "products/setProductOutOfStock",
  async(productId, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const response = await fetch(`http://localhost:9090/products/${productId}/outofstock`, {
      method: 'PUT',
    });
    if (!response.ok) {
      return rejectWithValue("Error al actualizar el stock.");
    }
    return await response.json();
  }
);

export const createProduct = createAsyncThunk<
Product,
Product,
{ rejectValue: string }
>(
  "products/createProduct",
  async (productData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const response = await fetch('http://localhost:9090/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      return rejectWithValue("Error al crear el producto.");
    }
    return await response.json();
  }
);

export const updateProduct = createAsyncThunk<
Product,
Product,
{ rejectValue: string }
>(
  "products/updateProduct",
  async (productData, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;
    const response = await fetch(`http://localhost:9090/products/${productData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      return rejectWithValue("Error al modificar el producto.");
    }
    return await response.json();
  }
);

export const deleteProduct = createAsyncThunk<
number,
number,
{ rejectValue: string }
>(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    const response = await fetch(`http://localhost:9090/products/${productId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return rejectWithValue("Error al eliminar el producto.");
    }
    return productId;
  }
);

export const getMetrics = createAsyncThunk<
Metrics[],
void,
{ rejectValue: string }
>(
  'products/getMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:9090/products/metrics');
      if (!response.ok) {
        return rejectWithValue("Error al obtener las métricas.");
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