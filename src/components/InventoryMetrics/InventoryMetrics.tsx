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
      <h2>Métricas de Inventario por Categoría</h2>
      <div className="metrics-grid">
        {metrics.map((metric) => (
          <div key={metric.category} className="metric-card">
            <h3>{metric.category.charAt(0).toUpperCase() + metric.category.slice(1)}</h3>
            <div className="metric-content">
              <div className="metric-item">
                <span className="metric-label">Total Productos:</span>
                <span className="metric-value">{metric.totalProducts}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Unidades en Stock:</span>
                <span className="metric-value">{metric.totalStockUnits}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Valor Total:</span>
                <span className="metric-value">${metric.totalStockValue}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Precio Promedio:</span>
                <span className="metric-value">${metric.avgPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryMetrics;