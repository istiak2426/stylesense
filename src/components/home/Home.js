// import { useState, useEffect } from "react";
// import Layout from "../Layout";
// import Card from "./Card";
// import CheckBox from "./CheckBox";
// import RadioBox from "./RadioBox";
// import { prices } from "../../utils/prices";
// import { showError, showSuccess } from "../../utils/messages";
// import {
//   getCategories,
//   getProducts,
//   getFilteredProducts,
// } from "../../api/apiProduct";
// import { addToCart } from "../../api/apiOrder";
// import { isAuthenticated, userInfo } from "../../utils/auth";

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [limit, setLimit] = useState(30);
//   const [skip, setSkip] = useState(0);
//   const [order, setOrder] = useState("desc");
//   const [sortBy, setSortBy] = useState("createdAt");
//   const [error, setError] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [filters, setFilters] = useState({
//     category: [],
//     price: [],
//   });

//   useEffect(() => {
//     getProducts(sortBy, order, limit)
//       .then((response) => setProducts(response.data))
//       .catch((err) => setError("Failed to load products!"));

//     getCategories()
//       .then((response) => setCategories(response.data))
//       .catch((err) => setError("Failed to load categories!"));
//   }, []);

//   const handleAddToCart = (product) => () => {
//     if (isAuthenticated()) {
//       setError(false);
//       setSuccess(false);
//       const user = userInfo();
//       const cartItem = {
//         user: user._id,
//         product: product._id,
//         price: product.price,
//       };
//       addToCart(user.token, cartItem)
//         .then((reponse) => setSuccess(true))
//         .catch((err) => {
//           if (err.response) setError(err.response.data);
//           else setError("Adding to cart failed!");
//         });
//     } else {
//       setSuccess(false);
//       setError("Please Login First!");
//     }
//   };

//   const handleFilters = (myfilters, filterBy) => {
//     const newFilters = { ...filters };
//     if (filterBy === "category") {
//       newFilters[filterBy] = myfilters;
//     }

//     if (filterBy === "price") {
//       const data = prices;
//       let arr = [];
//       for (let i in data) {
//         if (data[i].id === parseInt(myfilters)) {
//           arr = data[i].arr;
//         }
//       }
//       newFilters[filterBy] = arr;
//     }

//     setFilters(newFilters);
//     getFilteredProducts(skip, limit, newFilters, order, sortBy)
//       .then((response) => setProducts(response.data))
//       .catch((err) => setError("Failed to load products!"));
//   };

//   const showFilters = () => {
//     return (
//       <>
//         <div className="row">
//           <div className="col-sm-3">
//             <h5>Filter By Categories:</h5>
//             <ul>
//               <CheckBox
//                 categories={categories}
//                 handleFilters={(myfilters) =>
//                   handleFilters(myfilters, "category")
//                 }
//               />
//             </ul>
//           </div>
//           <div className="col-sm-5">
//             <h5>Filter By Price:</h5>
//             <div className="row">
//               <RadioBox
//                 prices={prices}
//                 handleFilters={(myfilters) => handleFilters(myfilters, "price")}
//               />
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   };

//   return (
//     <Layout title="Home Page" className="container-fluid">
//       {showFilters()}
//       <div style={{ width: "100%" }}>
//         {showError(error, error)}
//         {showSuccess(success, "Added to cart successfully!")}
//       </div>
//       <div className="row">
//         {products &&
//           products.map((product) => (
//             <Card
//               product={product}
//               key={product._id}
//               handleAddToCart={handleAddToCart(product)}
//             />
//           ))}
//       </div>
//     </Layout>
//   );
// };

// export default Home;

// import { useState, useEffect } from "react";
// import Layout from "../Layout";
// import Card from "./Card";
// import CheckBox from "./CheckBox";
// import RadioBox from "./RadioBox";
// import { prices } from "../../utils/prices";
// import { showError, showSuccess } from "../../utils/messages";
// import {
//   getCategories,
//   getProducts,
//   getFilteredProducts,
// } from "../../api/apiProduct";
// import { addToCart } from "../../api/apiOrder";
// import { isAuthenticated, userInfo } from "../../utils/auth";

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [filters, setFilters] = useState({ category: [], price: [] });

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const [productsData, categoriesData] = await Promise.all([
//           getProducts("createdAt", "desc", 30),
//           getCategories(),
//         ]);
//         setProducts(productsData.data);
//         setCategories(categoriesData.data);
//       } catch {
//         setError("Failed to load products or categories!");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadInitialData();
//   }, []);

//   const handleAddToCart = (product) => async () => {
//     if (!isAuthenticated()) {
//       setError("Please Login First!");
//       return;
//     }
//     setSuccess(null);
//     setError(null);
//     const user = userInfo();
//     const cartItem = {
//       user: user._id,
//       product: product._id,
//       price: product.price,
//     };

//     try {
//       await addToCart(user.token, cartItem);
//       setSuccess("Added to cart successfully!");
//     } catch (err) {
//       setError(err.response?.data || "Adding to cart failed!");
//     }
//   };

//   const handleFilters = (selectedFilters, filterBy) => {
//     const updatedFilters = {
//       ...filters,
//       [filterBy]:
//         filterBy === "price" ? getPriceRange(selectedFilters) : selectedFilters,
//     };
//     setFilters(updatedFilters);
//     applyFilters(updatedFilters);
//   };

//   const applyFilters = async (updatedFilters) => {
//     setLoading(true);
//     try {
//       const response = await getFilteredProducts(
//         0,
//         30,
//         updatedFilters,
//         "desc",
//         "createdAt"
//       );
//       setProducts(response.data);
//     } catch {
//       setError("Failed to load filtered products!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPriceRange = (priceId) => {
//     const priceRange = prices.find((price) => price.id === parseInt(priceId));
//     return priceRange ? priceRange.arr : [];
//   };

//   const renderFilters = () => (
//     <div className="filters row mb-4 p-3 bg-light rounded">
//       <div className="col-md-4">
//         <h5 className="mb-3">Filter By Categories</h5>
//         <CheckBox
//           categories={categories}
//           handleFilters={(filters) => handleFilters(filters, "category")}
//         />
//       </div>
//       <div className="col-md-4">
//         <h5 className="mb-3">Filter By Price</h5>
//         <RadioBox
//           prices={prices}
//           handleFilters={(filters) => handleFilters(filters, "price")}
//         />
//       </div>
//     </div>
//   );

//   const renderMessages = () => (
//     <div className="my-3">
//       {error && showError(error)}
//       {success && showSuccess(success)}
//     </div>
//   );

//   const renderProducts = () => {
//     if (loading)
//       return <div className="text-center my-5">Loading products...</div>;
//     if (!products.length)
//       return <div className="text-center my-5">No products found</div>;

//     return (
//       <div className="row">
//         {products.map((product) => (
//           <div className="col-md-4 col-lg-3 mb-4" key={product._id}>
//             <Card
//               product={product}
//               handleAddToCart={handleAddToCart(product)}
//             />
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <Layout title="Home Page" className="container-fluid">
//       {renderFilters()}
//       {renderMessages()}
//       {renderProducts()}
//     </Layout>
//   );
// };

// export default Home;

// import { useState, useEffect } from "react";

// import "./Home.css";
// import Layout from "../Layout";
// import Card from "./Card";
// import CheckBox from "./CheckBox";
// import RadioBox from "./RadioBox";
// import { prices } from "../../utils/prices";
// import { showError, showSuccess } from "../../utils/messages";
// import {
//   getCategories,
//   getProducts,
//   getFilteredProducts,
// } from "../../api/apiProduct";
// import { addToCart } from "../../api/apiOrder";
// import { isAuthenticated, userInfo } from "../../utils/auth";

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [filters, setFilters] = useState({ category: [], price: [] });

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const [productsData, categoriesData] = await Promise.all([
//           getProducts("createdAt", "desc", 30),
//           getCategories(),
//         ]);
//         setProducts(productsData.data);
//         setCategories(categoriesData.data);
//       } catch {
//         setError("Failed to load products or categories!");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadInitialData();
//   }, []);

//   const handleAddToCart = (product) => async () => {
//     if (!isAuthenticated()) {
//       setError("Please Login First!");
//       return;
//     }
//     setSuccess(null);
//     setError(null);
//     const user = userInfo();
//     const cartItem = {
//       user: user._id,
//       product: product._id,
//       price: product.price,
//     };

//     try {
//       await addToCart(user.token, cartItem);
//       setSuccess("Added to cart successfully!");
//     } catch (err) {
//       setError(err.response?.data || "Adding to cart failed!");
//     }
//   };

//   const handleFilters = (selectedFilters, filterBy) => {
//     const updatedFilters = {
//       ...filters,
//       [filterBy]:
//         filterBy === "price" ? getPriceRange(selectedFilters) : selectedFilters,
//     };
//     setFilters(updatedFilters);
//     applyFilters(updatedFilters);
//   };

//   const applyFilters = async (updatedFilters) => {
//     setLoading(true);
//     try {
//       const response = await getFilteredProducts(
//         0,
//         30,
//         updatedFilters,
//         "desc",
//         "createdAt"
//       );
//       setProducts(response.data);
//     } catch {
//       setError("Failed to load filtered products!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPriceRange = (priceId) => {
//     const priceRange = prices.find((price) => price.id === parseInt(priceId));
//     return priceRange ? priceRange.arr : [];
//   };

//   const renderFilters = () => (
//     <div className="filters row mb-4 p-3 bg-light rounded shadow-sm">
//       <div className="col-md-4">
//         <h5 className="mb-3">Filter By Categories</h5>
//         <CheckBox
//           categories={categories}
//           handleFilters={(filters) => handleFilters(filters, "category")}
//         />
//       </div>
//       <div className="col-md-4">
//         <h5 className="mb-3">Filter By Price</h5>
//         <RadioBox
//           prices={prices}
//           handleFilters={(filters) => handleFilters(filters, "price")}
//         />
//       </div>
//     </div>
//   );

//   const renderMessages = () => (
//     <div className="my-3">
//       {error && showError(error)}
//       {success && showSuccess(success)}
//     </div>
//   );

//   const renderProducts = () => {
//     if (loading)
//       return <div className="text-center my-5">Loading products...</div>;
//     if (!products.length)
//       return <div className="text-center my-5">No products found</div>;

//     return (
//       <div className="row">
//         {products.map((product) => (
//           <div className="col-md-4 col-lg-3 mb-4" key={product._id}>
//             <Card
//               product={product}
//               handleAddToCart={handleAddToCart(product)}
//             />
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <Layout title="Home Page" className="container-fluid home-page">
//       {renderFilters()}
//       {renderMessages()}
//       {renderProducts()}
//     </Layout>
//   );
// };

// export default Home;

// import { useState, useEffect } from "react";
// import Layout from "../Layout";
// import Card from "./Card";
// import CheckBox from "./CheckBox";
// import RadioBox from "./RadioBox";
// import { prices } from "../../utils/prices";
// import { showError, showSuccess } from "../../utils/messages";
// import {
//   getCategories,
//   getProducts,
//   getFilteredProducts,
// } from "../../api/apiProduct";
// import { addToCart } from "../../api/apiOrder";
// import { isAuthenticated, userInfo } from "../../utils/auth";
// import "./Home.css"; // Importing raw CSS file

// const Home = () => {
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [filters, setFilters] = useState({ category: [], price: [] });

//   useEffect(() => {
//     const loadInitialData = async () => {
//       try {
//         const [productsData, categoriesData] = await Promise.all([
//           getProducts("createdAt", "desc", 30),
//           getCategories(),
//         ]);
//         setProducts(productsData.data);
//         setCategories(categoriesData.data);
//       } catch {
//         setError("Failed to load products or categories!");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadInitialData();
//   }, []);

//   const handleAddToCart = (product) => async () => {
//     if (!isAuthenticated()) {
//       setError("Please Login First!");
//       return;
//     }
//     setSuccess(null);
//     setError(null);
//     const user = userInfo();
//     const cartItem = {
//       user: user._id,
//       product: product._id,
//       price: product.price,
//     };

//     try {
//       await addToCart(user.token, cartItem);
//       setSuccess("Added to cart successfully!");
//     } catch (err) {
//       setError(err.response?.data || "Adding to cart failed!");
//     }
//   };

//   const handleFilters = (selectedFilters, filterBy) => {
//     const updatedFilters = {
//       ...filters,
//       [filterBy]:
//         filterBy === "price" ? getPriceRange(selectedFilters) : selectedFilters,
//     };
//     setFilters(updatedFilters);
//     applyFilters(updatedFilters);
//   };

//   const applyFilters = async (updatedFilters) => {
//     setLoading(true);
//     try {
//       const response = await getFilteredProducts(
//         0,
//         30,
//         updatedFilters,
//         "desc",
//         "createdAt"
//       );
//       setProducts(response.data);
//     } catch {
//       setError("Failed to load filtered products!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPriceRange = (priceId) => {
//     const priceRange = prices.find((price) => price.id === parseInt(priceId));
//     return priceRange ? priceRange.arr : [];
//   };

//   const renderFilters = () => (
//     <div className="filters-container">
//       <div className="filter-section">
//         <h5>Filter By Categories</h5>
//         <CheckBox
//           categories={categories}
//           handleFilters={(filters) => handleFilters(filters, "category")}
//         />
//       </div>
//       <div className="filter-section">
//         <h5>Filter By Price</h5>
//         <RadioBox
//           prices={prices}
//           handleFilters={(filters) => handleFilters(filters, "price")}
//         />
//       </div>
//     </div>
//   );

//   const renderMessages = () => (
//     <div className="message-container">
//       {error && showError(error)}
//       {success && showSuccess(success)}
//     </div>
//   );

//   const renderProducts = () => {
//     if (loading) return <div className="loading-text">Loading products...</div>;
//     if (!products.length)
//       return <div className="loading-text">No products found</div>;

//     return (
//       <div className="products-container">
//         {products.map((product) => (
//           <Card
//             product={product}
//             key={product._id}
//             handleAddToCart={handleAddToCart(product)}
//           />
//         ))}
//       </div>
//     );
//   };

//   return (
//     <Layout title="Home Page" className="home-container">
//       {renderFilters()}
//       {renderMessages()}
//       {renderProducts()}
//     </Layout>
//   );
// };

// export default Home;

import { useState, useEffect } from "react";
import Layout from "../Layout";
import Card from "./Card";
import CheckBox from "./CheckBox";
import RadioBox from "./RadioBox";
import { prices } from "../../utils/prices";
import { showError, showSuccess } from "../../utils/messages";
import {
  getCategories,
  getProducts,
  getFilteredProducts,
} from "../../api/apiProduct";
import { addToCart } from "../../api/apiOrder";
import { isAuthenticated, userInfo } from "../../utils/auth";
import "./Home.css"; // Importing CSS for the updated layout

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, setFilters] = useState({ category: [], price: [] });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts("createdAt", "desc", 30),
          getCategories(),
        ]);
        setProducts(productsData.data);
        setCategories(categoriesData.data);
      } catch {
        setError("Failed to load products or categories!");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleAddToCart = (product) => async () => {
    if (!isAuthenticated()) {
      setError("Please Login First!");
      return;
    }
    setSuccess(null);
    setError(null);
    const user = userInfo();
    const cartItem = {
      user: user._id,
      product: product._id,
      price: product.price,
    };

    try {
      await addToCart(user.token, cartItem);
      setSuccess("Added to cart successfully!");
    } catch (err) {
      setError(err.response?.data || "Adding to cart failed!");
    }
  };

  const handleFilters = (selectedFilters, filterBy) => {
    const updatedFilters = {
      ...filters,
      [filterBy]:
        filterBy === "price" ? getPriceRange(selectedFilters) : selectedFilters,
    };
    setFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  const applyFilters = async (updatedFilters) => {
    setLoading(true);
    try {
      const response = await getFilteredProducts(
        0,
        30,
        updatedFilters,
        "desc",
        "createdAt"
      );
      setProducts(response.data);
    } catch {
      setError("Failed to load filtered products!");
    } finally {
      setLoading(false);
    }
  };

  const getPriceRange = (priceId) => {
    const priceRange = prices.find((price) => price.id === parseInt(priceId));
    return priceRange ? priceRange.arr : [];
  };

  const renderFilters = () => (
    <div className="filters-container">
      <div className="filter-section">
        <h5>Categories</h5>
        <CheckBox
          categories={categories}
          handleFilters={(filters) => handleFilters(filters, "category")}
        />
      </div>
      <div className="filter-section">
        <h5>Price Range</h5>
        <RadioBox
          prices={prices}
          handleFilters={(filters) => handleFilters(filters, "price")}
        />
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="message-container">
      {error && showError(error)}
      {success && showSuccess(success)}
    </div>
  );

  const renderProducts = () => {
    if (loading) return <div className="loading-text">Loading products...</div>;
    if (!products.length)
      return <div className="loading-text">No products found</div>;

    return (
      <div className="products-grid">
        {products.map((product) => (
          <Card
            product={product}
            key={product._id}
            handleAddToCart={handleAddToCart(product)}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout title="Home Page" className="home-container">
      <div className="home-layout">
        <aside className="sidebar">{renderFilters()}</aside>
        <main className="main-content">
          {renderMessages()}
          {renderProducts()}
        </main>
      </div>
    </Layout>
  );
};

export default Home;
