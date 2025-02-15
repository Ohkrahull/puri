import React, { useState } from 'react';

const MyTable = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" },
    { id: 2, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" },
    { id: 3, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" }, { id: 1, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" },
    { id: 4, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" },
    { id: 5, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" },
    { id: 6, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" },
    { id: 7, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" },

    { id: 8, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" },
    { id: 9, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" },
    { id: 10, name: "Apple iMac 27\"", category: "Desktop PC", stock: 95, salesPerDay: 1.47, salesPerMonth: 0.47, rating: 5, sales: "1.6M", revenue: "$3.2M", lastUpdate: "Just now" },// ... add more products as needed
  ]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
      <div className="px-4 mx-auto max-w-screen-3xl lg:px-12">
        <div className="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div className="flex items-center flex-1 space-x-4">
              <h5>
                <span className="text-gray-500">All Products:</span>
                <span className="dark:text-white">123456</span>
              </h5>
              <h5>
                <span className="text-gray-500">Total sales:</span>
                <span className="dark:text-white">$88.4k</span>
              </h5>
            </div>
            <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
              <button type="button" className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Add new product
              </button>
              {/* ... other buttons ... */}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input id="checkbox-all" type="checkbox" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3">Product</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Stock</th>
                  {/* <th scope="col" className="px-4 py-3">Sales/Day</th> */}
                  {/* <th scope="col" className="px-4 py-3">Sales/Month</th> */}
                  <th scope="col" className="px-4 py-3">Rating</th>
                  <th scope="col" className="px-4 py-3">Sales</th>
                  <th scope="col" className="px-4 py-3">Revenue</th>
                  <th scope="col" className="px-4 py-3">Last Update</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="w-4 px-4 py-3">
                      <div className="flex items-center">
                        <input id={`checkbox-table-${product.id}`} type="checkbox" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor={`checkbox-table-${product.id}`} className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <th scope="row" className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <img src="https://flowbite.s3.amazonaws.com/blocks/application-ui/products/imac-front-image.png" alt="iMac Front Image" className="w-auto h-8 mr-3" />
                      {product.name}
                    </th>
                    <td className="px-4 py-2">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">{product.category}</span>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center">
                        <div className="inline-block w-4 h-4 mr-2 bg-red-700 rounded-full"></div>
                        {product.stock}
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.salesPerDay}</td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.salesPerMonth}</td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {/* ... Rating stars ... */}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 text-gray-400" aria-hidden="true">
                          <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                        </svg>
                        {product.sales}
                      </div>
                    </td>
                    <td className="px-4 py-2">{product.revenue}</td>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{product.lastUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* ... Pagination ... */}
        </div>
      </div>
    </section>
  );
};

export default MyTable;