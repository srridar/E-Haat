import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate , useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChevronRight, Filter, Search, RotateCcw,
  ArrowLeft, ArrowUpDown, ArrowDown, ShoppingCart,Truck, ShieldCheck
} from "lucide-react";
import { PRODUCT_API_END_POINT } from "@/utils/constants";

const GetSellerProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  const { id } = useParams(); 
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  const categories = [
    { name: "Groceries & Fresh", sub: ["Vegetables", "Fruits", "Grains", "Dairy", "Food"] },
    { name: "Lifestyle & Home", sub: ["Clothing", "Furniture"] },
    { name: "Tech", sub: ["Electronics"] },
    { name: "More", sub: ["Other"] },
  ];

  useEffect(() => {

    const fetchAllProducts = async () => {
      try {
        const res = await axios.get( `${PRODUCT_API_END_POINT}/seller/${id}/products`,
          {
            params: {
              search: search || "",
              categories: selectedCategories.join(",")
            },
            withCredentials: true
          }
        );

        if (res.data.success) {
          setAllProducts(res.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();

  }, [id, search, selectedCategories]);



  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSortBy("newest");
  };

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium animate-pulse">Curating the best for you...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6EC]">
      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b  px-6 py-2 flex items-center justify-between shadow-sm">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-900 hover:text-indigo-600 transition-all font-bold group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => navigate("/product/cart")}
          className="relative bg-slate-900 text-white p-3 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <ShoppingCart size={22} />
          {items?.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
              {items.length}
            </span>
          )}
        </button>
      </nav>

      <div className="max-w-[1600px] mx-auto  sm:px-4 pt-20  pb-12">

        <section className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>

          <div className="relative px-10 py-10 md:py-14 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-widest uppercase">
                <Truck size={14} />
                Simplified Logistics in Nepal
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1]">
                Bulk Orders <br />
                <span className="text-orange-500">Simplified.</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
                Connect directly with verified suppliers. Track every move from the warehouse to your doorstep.
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <button className="px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl shadow-lg shadow-orange-900/40 transition-all flex items-center justify-center gap-2 group">
                  <a href="#main"> Start Shooping </a>
                  <ArrowDown size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-4 text-slate-500 text-sm pl-2">
                  <div className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-green-500" /> Insured</div>
                  <div className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-green-500" /> Verified</div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <div id="main" className="flex flex-col lg:flex-row gap-4">
          <aside className="w-full lg:w-64 space-y-6 text-white ">
            <div className="sticky top-28 bg-slate-900  p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <h3 className="font-bold text-lg  flex items-center gap-2">
                  <Filter size={18} className="text-indigo-600" /> Filters
                </h3>
                <button onClick={resetFilters} className="p-2 hover:bg-red-50  hover:text-red-500 rounded-xl transition-all">
                  <RotateCcw size={16} />
                </button>
              </div>

              <div className="relative text-black">
                <Search className="absolute left-1 top-1/2 -translate-y-1/2 " size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]  pl-1">Categories</h4>
                {categories.map((cat) => (
                  <div key={cat.name} className="space-y-3">
                    <p className="text-xs font-bold  px-1">{cat.name}</p>
                    <div className="space-y-2 ml-1">
                      {cat.sub.map((sub) => (
                        <label key={sub} className="flex items-center gap-3 text-sm  hover:text-indigo-600 cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(sub)}
                            onChange={() => handleCategoryChange(sub)}
                            className="w-4 h-4 rounded-md border-slate-200 text-indigo-600 focus:ring-indigo-500"
                          />
                          {sub}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verified Goods from Particular Seler</h2>
                <p className="text-slate-500 font-medium">Found {sortedProducts.length} premium listings</p>
              </div>

              <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 px-3 border-r border-slate-100">
                  <ArrowUpDown size={16} className="text-indigo-600" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none text-xs font-bold text-slate-700 focus:ring-0 cursor-pointer outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low</option>
                    <option value="price-high">Price: High</option>
                  </select>
                </div>
              </div>
            </header>

            {sortedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <div className="bg-slate-50 p-6 rounded-full mb-4 text-slate-300">
                  <Search size={48} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No matches found</h3>
                <p className="text-slate-400">Try clearing your filters or changing keywords.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {sortedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-slate-200 text-black rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-50 overflow-hidden cursor-pointer flex flex-col"
                  >
                    <div className="h-60 relative overflow-hidden">
                      <img
                        src={product.images[0]?.url || "/placeholder-image.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4  backdrop-blur-2xl px-3 py-1.5 rounded-xl border border-orange-100 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-black">
                          {product?.seller?.location?.city
                            ?.split(",")
                            .slice(3, 6)
                            .join(", ") || "Nepal"}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-bold text-white uppercase tracking-tighter">
                        {product.category}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                        {product.name}
                      </h3>
                      <p className=" text-xs line-clamp-2 mb-4 flex-1 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest mb-1">NPR / {product.unit}</p>
                          <p className="text-xl font-black text-slate-900 tracking-tight">
                            {product.price.toLocaleString()}
                          </p>
                        </div>
                        <div onClick={() => navigate("/product/" + product._id)} className="bg-slate-50 text-slate-900 p-3 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div >
    </div >
  );
};

export default GetSellerProducts;