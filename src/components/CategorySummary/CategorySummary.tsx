import React from "react";

interface CategorySummaryProps {
  categoriesData: {
    category: string;
    totalStock: number;
    totalValue: number;
    avgPrice: number;
  }[];
  overallData: {
    totalStock: number;
    totalValue: number;
    avgPrice: number;
  };
}

const CategorySummary: React.FC<CategorySummaryProps> = ({categoriesData, overallData}) => {
  return (
    <div className="overflow-x-auto mt-8">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Total stock</th>
            <th className="border px-4 py-2">Total Value</th>
            <th className="border px-4 py-2">Average price</th>
          </tr>
        </thead>

        <tbody>
          {categoriesData.map((data, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{data.category}</td>
              <td className="border px-4 py-2">{data.totalStock}</td>
              <td className="border px-4 py-2">{data.totalValue}</td>
              <td className="border px-4 py-2">{data.avgPrice}</td>
            </tr>
          ))}

          <tr className="bg-gray-100">
            <td className="border px-4 py-2">Overall</td>
            <td className="border px-4 py-2">{overallData.totalStock}</td>
            <td className="border px-4 py-2">{overallData.totalValue}</td>
            <td className="border px-4 py-2">{overallData.avgPrice}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CategorySummary;