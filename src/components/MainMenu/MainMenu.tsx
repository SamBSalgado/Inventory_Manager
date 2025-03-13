import { useDispatch, useSelector } from 'react-redux';
import './MainMenu.css';
import { AppDispatch, RootState } from '../../state/store';
import { fetchProducts, setFilters, Product } from '../../state/product/productSlice';
import React, { useEffect, useState } from 'react';
import ProductModal from '../../modals/create_edit/create_edit-Modal';

const MainMenu = () => {

  const { products } = useSelector((state: RootState) => state.product); //Esto es para poder mostrar el producto
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.product.filters);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const updatedCategories = checked
      ? [...filters.category, value]
      : filters.category.filter((category) => category !== value);

      dispatch(setFilters({ category: updatedCategories }));
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
              value="food" 
              checked={filters.category.includes("food")} 
              onChange={handleCategoryChange}
              />
              Food
            </label>

            <label>
              <input 
              type="checkbox" 
              value="electronics"
              checked={filters.category.includes("electronics")} 
              onChange={handleCategoryChange}
              />
              Electronics
            </label>

            <label>
              <input 
              type="checkbox"
              value="clothing"
              checked={filters.category.includes("clothing")}
              onChange={handleCategoryChange}
              />
              Clothing
            </label>
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
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantityInStock}</td>
                <td>${product.unitPrice.toFixed(2)}</td>
                <td>
                  <button 
                    className="edit-btn" 
                    onClick={() => openEditModal(product)}
                  >
                    Edit
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
    </div>
  );
};

export default MainMenu;