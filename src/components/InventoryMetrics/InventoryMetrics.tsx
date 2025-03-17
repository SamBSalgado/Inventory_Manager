import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getMetrics } from "../../state/product/productSlice";
import './InventoryMetrics.css';


const InventoryMetrics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { metrics, loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(getMetrics());
  }, [dispatch]);

  if (loading) {
    return <div className="metrics-loading">Cargando métricas...</div>;
  }

  if (error) {
    return <div className="metrics-error">Error: {error}</div>;
  }
  
  if (!metrics || metrics.length === 0) {
    return <div className="metrics-empty">No hay métricas que mostrar. Inventario vacío.</div>;
  }

  return (
    <div className="inventory-metrics">
      <h2>Inventory metrics</h2>
      <div className="metrics-table-container">
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total products in Stock</th>
              <th>Total value in Stock</th>
              <th>Average price in Stock</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.category}>
                <td className="category-cell">{metric.category.charAt(0).toUpperCase() + metric.category.slice(1)}</td>
                <td>{metric.totalStockUnits}</td>
                <td>${metric.totalStockValue.toFixed(2)}</td>
                <td>${metric.avgPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryMetrics;