import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import './create_edit-Modal.css';
import { createProduct, updateProduct, fetchCategories } from "../../state/product/productSlice";


interface Product {
  id?: number;
  name: string;
  category: string;
  quantityInStock: number;
  unitPrice: number;
  expirationDate?: string;
}

interface productModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  mode: 'create' | 'edit';
}

const ProductModal: React.FC<productModalProps> = ({ isOpen, onClose, product, mode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.product.categories);
  const [newCategory, setNewCategory] = useState<string>("");
  const [showNewCategoryInput, setShowNewcategoryInput] = useState<boolean>(false);

  const [formData, setFormData] = useState<Product>({
    name: '',
    category: '',
    quantityInStock: 0,
    unitPrice: 0,
    expirationDate: '',
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (mode == 'edit' && product) {
      setFormData({ ...product });
    } else {
      setFormData({
        name: '',
        category: categories.length > 0 ? categories[0] : '',
        quantityInStock: 0,
        unitPrice: 0,
        expirationDate: '',
      });
    }
  }, [product, mode, isOpen, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'quantityInStock' || name === 'unitPrice') {
      setFormData({ ...formData, [name]: Number(value) });
    } else if (name === 'name' && value.length > 120) {
      setFormData({ ...formData, [name]: value.slice(0, 120) });
    } else if (name === 'category' && value === 'new') {
      setShowNewcategoryInput(true);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      setFormData({ ...formData, category: newCategory.trim() });
      setShowNewcategoryInput(false);
      setNewCategory("");
    }
  };

  const cancelNewcategory = () => {
    setShowNewcategoryInput(false);
    setNewCategory("");
    setFormData({ ...formData, category: categories.length > 0 ? categories[0] : '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Datos enviados al backend: ", formData);

    if (mode === 'create') {
      dispatch(createProduct(formData));
    } else if (mode === 'edit' && product?.id) {
      dispatch(updateProduct({ ...formData, id: product.id }));
    }

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{mode === 'create' ? 'Add New Product' : 'Edit Product'}</h2>
          <button className="close-button" onClick={onClose}>x</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required
              maxLength={120}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            {!showNewCategoryInput ? (
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                ) : (
                  <option value="">No categories available</option>
                )}
                <option value="new">+ Add new category</option>
                </select>
            ) : (
              <div className="new-category-container">
                <input
                type="text"
                id="newCategory"
                value={newCategory}
                onChange={handleNewCategoryChange}
                placeholder="Enter new category name"
                required
                />
                <div className="new-category-actions">
                  <button type="button" onClick={handleAddNewCategory}>Add</button>
                  <button type="button" onClick={cancelNewcategory}>Cancel</button>
                </div>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="quantityInStock">Quantity in Stock</label>
            <input 
              type="number" 
              id="quantityInStock" 
              name="quantityInStock" 
              value={formData.quantityInStock} 
              onChange={handleChange} 
              required 
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="unitPrice">Unit Price</label>
            <input 
              type="number" 
              id="unitPrice" 
              name="unitPrice" 
              value={formData.unitPrice} 
              onChange={handleChange} 
              required 
              step="0.5"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="expirationDate">Expiration Date (optional)</label>
            <input 
              type="date" 
              id="expirationDate" 
              name="expirationDate" 
              value={formData.expirationDate || ''} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-button">
              {mode === 'create' ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;