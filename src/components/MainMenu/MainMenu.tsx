import { useDispatch, useSelector } from 'react-redux';
import './MainMenu.css';
import { AppDispatch, RootState } from '../../state/store';
import { fetchProducts, setFilters, Product, deleteProduct, setProductInStock, setProductOutOfStock, fetchCategories } from '../../state/product/productSlice';
import React, { useEffect, useState } from 'react';
import ProductModal from '../../modals/create_edit/create_edit-Modal';
import InventoryMetrics from '../InventoryMetrics/InventoryMetrics';

const MainMenu = () => {

  const { products } = useSelector((state: RootState) => state.product); //Esto es para poder mostrar el producto
  const categories = useSelector((state: RootState) => state.product.categories);
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.product.filters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectAllCategories, setSelectAllCategories] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories.length > 0 && filters.category.length === categories.length) {
      setSelectAllCategories(true);
    } else {
      setSelectAllCategories(false);
    }
  }, [filters.category, categories]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (value === 'all') {
      if (checked) {
        dispatch(setFilters({ category: [...categories] }));
      } else {
        dispatch(setFilters({ category: [] }));
      }
      setSelectAllCategories(checked);
    } else {
      const updatedCategories = checked
      ? [...filters.category, value]
      : filters.category.filter((category) => category !== value);
      
      dispatch(setFilters({ category: updatedCategories }));
    }
  };

  const handleSearch = () => {
    console.log("Buscando con filtros:", filters);
    dispatch((fetchProducts(filters)));
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(fetchCategories());
  };

  const handleDelete = (productId: number) => {
    dispatch(deleteProduct(productId));
  }

  const handleStockChange = (product: Product) => {
    if (product.quantityInStock > 0) {
      dispatch(setProductOutOfStock(product.id));
    } else {
      dispatch(setProductInStock(product.id));
    }
  };

  // const handleClearFilters = () => {
  //   dispatch(setFilters({ name: "", category: [], availability: "" }));
  //   setHasSearched(false);
  //   dispatch(fetchProducts({}));
  // };
  // const [name, setName] = useState("");
  // const [categories, setCategories] = useState<string[]>([]);
  // const [availability, setAvailability] = useState("");

  return (
    <div className="main-menu">
      <div className='filters'>

        <div className='input-group'>
          <label htmlFor="name" className='input-label'>Name</label>
          <input 
          id='name' 
          type="text" 
          placeholder="Search by name..." 
          className="name-input" 
          value={filters.name} 
          onChange={(e) => dispatch(setFilters({ name: e.target.value }))}
          />
        </div>

        <div className='input-group'>
          <label className='input-label'>Category</label>
          <div className='category-checkboxes'>
            <label>
              <input 
              type="checkbox" 
              value="all" 
              checked={selectAllCategories} 
              onChange={handleCategoryChange}
              />
              All
            </label>

            {categories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  value={category}
                  checked={filters.category.includes(category)}
                  onChange={handleCategoryChange}
                />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className='bottom-form'>
          <label htmlFor="availability" className='input-label'>Availability</label>
          <select 
          id='availability' 
          className="dropdown" 
          value={filters.availability} 
          onChange={(e) => dispatch(setFilters({ availability: e.target.value }))}
          >
            <option value="all">All</option>
            <option value="available">In stock</option>
            <option value="unavailable">Out of stock</option>
          </select>

          <button className="search-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>

      <button className="new_product-btn" onClick={openCreateModal}>New product</button>
      <div className="product-list">
        <table className="products-table">
          <thead>
            <tr>
              <th>Toggle stock</th>
              <th>Category</th>
              <th>Name</th>
              <th>Price</th>
              <th>Expiration Date</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td><button className={`toggle-stock-btn ${product.quantityInStock > 0 ? "reset-stock" : "restore-stock"}`} onClick={() => handleStockChange(product)}>{product.quantityInStock > 0 ? "Reset stock" : "Restore default stock"}</button></td>
                <td>{product.category}</td>
                <td>{product.name}</td>
                <td>${product.unitPrice.toFixed(2)}</td>
                <td>{product.expirationDate}</td>
                <td>{product.quantityInStock}</td>
                <td className="actions-td">
                  <button 
                    className="edit-btn" 
                    onClick={() => openEditModal(product)}
                  >
                    Edit
                  </button>

                  <button
                  className="delete-btn"
                  onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ProductModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
        mode={modalMode}
      />

      <div className='metrics-section'>
        <InventoryMetrics></InventoryMetrics>
      </div>
    </div>
  );
};

export default MainMenu;