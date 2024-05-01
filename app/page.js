"use client"
import Header from "@/components/Header";
import Image from "next/image";
import { useState, useEffect } from 'react'

export default function Home() {
  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false)
  const [dropdown, setDropdown] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product/')
      let rjson = await response.json()
      setProducts(rjson.products)
    }
    fetchProducts()
  }, [])

  const buttonAction= async (action, slug, initialQuantity) => {
    //immediately change the quantity of the product with given slug in Products
    let index= products.findIndex((item)=> item.slug ==slug)
    let newProducts= JSON.parse(JSON.stringify(products))
    if (action =="plus"){
      newProducts[index].quantity = parseInt(initialQuantity) +1
    }
    else{
      newProducts[index].quantity =parseInt(initialQuantity) -1
    }
    setProducts(newProducts)

    //immediately change the quantity of the product with given slug in Dropdown
    let indexdrop= dropdown.findIndex((item)=> item.slug ==slug)
    let newDropdown= JSON.parse(JSON.stringify(dropdown))
    if (action =="plus"){
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) +1
    }
    else{
      newDropdown[indexdrop].quantity =parseInt(initialQuantity) -1
    }
    setDropdown(newDropdown)


    console.log(action, slug)
    setLoadingaction(true)
    const response = await fetch('/api/action/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({action, slug, initialQuantity}),
    });
    let r= await response.json()
    console.log(r)
    setLoadingaction(false)
  }

  const addProduct = async (e) => {
    //Fetch all the products to sync back

    try {
      const response = await fetch('/api/product/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        // Product added successfully, you can add further logic here
        console.log('Product added successfully');
        setAlert('Your Product has been Added!')
        setProductForm({})
      } else {
        // Handle error
        console.error('Failed to add product');
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
    }
    const response = await fetch('/api/product/')
    let rjson = await response.json()
    setProducts(rjson.products)
    e.preventDefault();
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const onDropdownEdit= async (e) => {
    let value= e.target.value
    setQuery(value)
    if (value.length>2){
      setLoading(true)
      setDropdown([])
      const response = await fetch('/api/search?query=' + query)
      let rjson = await response.json()
      setDropdown(rjson.products)
      setLoading(false)
    }
    else{
      setDropdown([])
    }
  }


   

  return (
    <>
      <Header />

      <div className='text-green-500 text-center'>{alert}</div>
      <div className="container my-6 mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
        <div className="flex mb-2">
          <input onChange={onDropdownEdit}
            type="text"
            placeholder="Enter product name..."
            className="border border-gray-300 px-3 py-2 rounded-l-md flex-grow"
          />
          <select className="border border-gray-300 px-3 py-2 rounded-r-md bg-white">
            <option value="">All</option>
            <option value="Category 1">Category 1</option>
            <option value="Category 2">Category 2</option>
            {/* Add more options if needed */}
          </select>
        </div>

        {loading && <div className="flex justify-center items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" display="block" width="50px "height="50px">
        <circle cx="50"cy="50"fill="none"stroke="#000" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
        <animateTransform attributeName="transform"type="rotate"repeatCount="indefinite"dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
        </circle>
        </svg>
        </div>
        }

        <div className="dropcontainer absolute w-[73vw] border border-1 bg-purple-100 rounded">

        {dropdown.map(item => {
          return <div key={item.slug} className="container flex justify-between p-2 my-1 border-b-2">

            <span className="slug">{item.slug} ({item.quantity} available for₹{item.price})</span>

            <div className="mx-5">
            <button onClick={() => { buttonAction("minus", item.slug, item.quantity) }} disabled={loadingaction} className={`subtract cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md ${loadingaction ? 'bg-pink-100' : ''} disabled:bg-purple-200`}>-</button>

            <span className="quantity inline-block w-3 mx-3">{item.quantity}</span>

            <button onClick={() => { buttonAction("plus", item.slug, item.quantity) }} disabled={loadingaction} className={`add cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md ${loadingaction ? 'bg-pink-100' : ''} disabled:bg-purple-200`}>+</button>

            </div>
          </div>
        })}
        </div>
      </div>

      {/* Add a Product*/}
      <div className="container my-8 mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>

        <form>
          <div className="mb-4">
            <label htmlFor="productName" className="block text-gray-700">
              Product Slug:
            </label>
            <input value={productForm?.slug || ""} name="slug" onChange={handleChange}
              type="text"
              id="productName"
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-700">
              Quantity:
            </label>
            <input value={productForm?.quantity || ""} name="quantity" onChange={handleChange}
              type="number"
              id="quantity"
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700">
              Price:
            </label>
            <input value={productForm?.price || ""} name="price" onChange={handleChange}
              type="number"
              id="price"
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
            />
          </div>
          <button onClick={addProduct}
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white text-white px-4 py-2 rounded-md"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Display Current Stock */}
      <div className="container my-8 mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>

        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              return <tr key={product.slug}>
                <td className="border px-4 py-2">{product.slug}</td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2">₹{product.price}</td>
              </tr>
            })}
            {/* Add more rows for each product */}
          </tbody>
        </table>
      </div>
    </>
  );
}
