import { useDispatch, useSelector } from 'react-redux';
import './MainMenu.css';
import { AppDispatch, RootState } from '../../state/store';
import { fetchProducts, setFilters } from '../../state/product/productSlice';
import React, { useEffect } from 'react';

const MainMenu = () => {

  const { products } = useSelector((state: RootState) => state.product); //Esto es para poder mostrar el producto
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.product.filters);

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

      <button className="new_product-btn">New product</button>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} - {product.category} </li>
        ))}
      </ul>
    </div>
  );
};

export default MainMenu;