// import React from "react";
import './MainMenu.css';

const MainMenu = () => {
  // const [name, setName] = useState("");
  // const [categories, setCategories] = useState<string[]>([]);
  // const [availability, setAvailability] = useState("");

  return (
    <div className="main-menu">
      <div className='filters'>

        <div className='input-group'>
          <label htmlFor="name" className='input-label'>Name</label>
          <input id='name' type="text" placeholder="Search by name..." className="name-input"/>
        </div>

        <div className='input-group'>
        <label htmlFor="category" className='input-label'>Category</label>
          <select multiple id='category' className="dropdown">
            <option value="food">Food</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>

        <div className='bottom-form'>
          <label htmlFor="availability" className='input-label'>Availability</label>
          <select id='availability' className="dropdown">
            <option value="available">In stock</option>
            <option value="unavailable">Out of stock</option>
            <option value="all">All</option>
          </select>

          <button className="search-btn">Search</button>
        </div>
      </div>

      <button className="new_product-btn">New product</button>
      
    </div>
  );
};

export default MainMenu;