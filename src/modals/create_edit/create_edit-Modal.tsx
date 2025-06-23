import React, { useState, useEffect } from "react";
import './create_edit-Modal.css';
import { Product } from "../../state/product/productSlice";
import { useProductForm } from "../../hooks/ProductForm";

interface productModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: string[];
  onSubmit: (data: Product) => void;
  mode: 'create' | 'edit';
}

const ProductModal: React.FC<productModalProps> = ({ isOpen, onClose, product, mode, categories, onSubmit }) => {
  const [newCategory, setNewCategory] = useState<string>("");
  const [showNewCategoryInput, setShowNewcategoryInput] = useState<boolean>(false);

  const {formData, setFormData, handleChange} = useProductForm({
    initialData: product ?? undefined,
    categories,
    onCategoryNewSelected: () => setShowNewcategoryInput(true)
  });

  useEffect(() => {
    if (mode == 'edit' && product) {
      setFormData({ ...product });
    } else {
      setFormData({
        id: undefined,
        name: '',
        category: categories.length > 0 ? categories[0] : 'no-category',
        quantityInStock: 0,
        unitPrice: 0,
        expirationDate: '',
      });
    }
    setShowNewcategoryInput(false);
    setNewCategory("");
  }, [product, mode, isOpen, categories, setFormData]);

  const handleCategorySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === "new") {
      setShowNewcategoryInput(true);
      setFormData({ ...formData, category: value });
    } else {
      handleChange(e);
    }
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const cancelNewcategory = () => {
    setShowNewcategoryInput(false);
    setNewCategory("");
    setFormData({ ...formData, category: categories.length > 0 ? categories[0] : '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalFormData = showNewCategoryInput
      ? { ...formData, category: newCategory.trim() }
      : formData;

      if (finalFormData.category === 'no-category') {
        finalFormData.category = '';
      }

    onSubmit(finalFormData);
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
                value={formData.category === "new" ? "new": formData.category}
                onChange={handleCategorySelectChange}
                required
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))
              ): (
                <option value="no-category">No categories available</option>
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
                autoFocus
                />
                <div className="new-category-actions">
                  <button type="button" onClick={cancelNewcategory}>Cancel</button>
                </div>
              </div>
            )}
            {showNewCategoryInput && (
              <small style={{ color: '#666', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                New category: {newCategory.trim() || '[Enter category name]'}
              </small>
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