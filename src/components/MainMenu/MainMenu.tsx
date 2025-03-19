import { useDispatch, useSelector } from 'react-redux';
import './MainMenu.css';
import { AppDispatch, RootState } from '../../state/store';
import { fetchProducts, setFilters, Product, deleteProduct, setProductInStock, setProductOutOfStock, fetchCategories, getMetrics } from '../../state/product/productSlice';
import React, { useEffect, useState } from 'react';
import ProductModal from '../../modals/create_edit/create_edit-Modal';
import InventoryMetrics from '../InventoryMetrics/InventoryMetrics';
import DataTable, { TableColumn } from 'react-data-table-component';

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

  const handleDelete = async (productId: number) => {
    await dispatch(deleteProduct(productId));
    await dispatch(fetchProducts({}));
    await dispatch(getMetrics());
  }

  const handleStockChange = async (product: Product) => {
    if (product.quantityInStock > 0) {
      await dispatch(setProductOutOfStock(product.id));
    } else {
      await dispatch(setProductInStock(product.id));
    }
    await dispatch(fetchProducts({}));
    await dispatch(getMetrics());
  };

  const columns: TableColumn<Product>[] = [
    {
      name: 'Toggle Stock',
      cell: (row: Product) => (
        <button 
          className={`toggle-stock-btn ${row.quantityInStock > 0 ? "reset-stock" : "restore-stock"}`} 
          onClick={() => handleStockChange(row)}
        >
          {row.quantityInStock > 0 ? "Reset stock" : "Restore default stock"}
        </button>
      ),
      ignoreRowClick: true,
      width: '170px',
    },
    {
      name: 'Category',
      selector: row => row.category || '',  // Aseguramos que no sea undefined
      sortable: true,
      width: '150px',
      id: 'category',
    },
    {
      name: 'Name',
      selector: row => row.name || '',  // Aseguramos que no sea undefined
      sortable: true,
      width: '200px',
      id: 'name',
    },
    {
      name: 'Price',
      selector: row => row.unitPrice,
      format: row => `$${row.unitPrice.toFixed(2)}`,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Expiration Date',
      selector: row => {
        return row.expirationDate ? new Date(row.expirationDate).toLocaleDateString() : '';
      },
      sortable: true,
      width: '150px',
    },
    {
      name: 'Stock',
      selector: row => row.quantityInStock,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Actions',
      cell: (row: Product) => (
        <div className="actions-td">
          <button 
            className="edit-btn" 
            onClick={() => openEditModal(row)}
          >
            Edit
          </button>
          <button
            className="delete-btn"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: '200px',
    },
  ];

  const customStyles = {
    table: {
      style: {
        width: '100%',
      },
    },
    rows: {
      style: {
        minHeight: '60px',
      },
    },
    headCells: {
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        backgroundColor: '#f3f4f6',
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: 'Products per page:',
    rangeSeparatorText: 'of',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'All',
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
      <DataTable
          columns={columns}
          data={products}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          paginationComponentOptions={paginationComponentOptions}
          customStyles={customStyles}
          noDataComponent="No products found"
          defaultSortFieldId="name"
          defaultSortAsc={true}
          highlightOnHover
          pointerOnHover
          responsive
        />
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