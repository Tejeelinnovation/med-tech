"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ProductsPage() {

    const { data: session } = useSession();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [discount, setDiscount] = useState("");

    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState("");

    const loadProducts = async () => {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const resetForm = () => {
        setEditId(null);
        setName("");
        setPrice("");
        setImage("");
        setCategory("");
        setDescription("");
        setStock("");
        setDiscount("");
    };

    const addProduct = async () => {
        await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: session?.user?.email,
                name,
                category,
                description,
                price: Number(price),
                stock: Number(stock),
                discount: Number(discount) || 0,
                prescriptionRequired: false,
                image,
            }),
        });

        setMessage("Product added successfully");
        resetForm();
        loadProducts();
    };

    const updateProduct = async () => {
        await fetch(`/api/products/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                description,
                price: Number(price),
                image,
                category,
                stock: Number(stock),
                discount: Number(discount) || 0,
            }),
        });

        setMessage("Product updated successfully");
        resetForm();
        loadProducts();
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this product?")) return;
        await fetch(`/api/products/${id}`, { method: "DELETE" });
        loadProducts();
    };

    const startEdit = (p) => {
        setEditId(p._id);
        setName(p.name);
        setPrice(p.price);
        setImage(p.image);
        setCategory(p.category);
        setDescription(p.description);
        setStock(p.stock);
        setDiscount(p.discount || 0);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const filteredProducts = products
        .filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((p) =>
            filterCategory === "all" ? true : p.category === filterCategory
        );

    return (
        <div className="space-y-10">

            {/* HEADER */}
            <div>
                <h1 className="text-4xl font-bold text-[#6B8E23]">
                    Product Management
                </h1>

            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* ===== FORM ===== */}
                <div className="card">

                    <h2 className="section-title">
                        {editId ? "Edit Product" : "Add Product"}
                    </h2>

                    <Input value={name} set={setName} placeholder="Product Name" />
                    <Input value={price} set={setPrice} placeholder="Price" type="number" />
                    <Input value={stock} set={setStock} placeholder="Stock" type="number" />
                    <Input value={discount} set={setDiscount} placeholder="Discount (%)" type="number" />
                    <Input value={image} set={setImage} placeholder="Image URL" />

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input"
                    >
                        <option value="">Select Category</option>
                        <option>Hair Oil</option>
                        <option>Hair Tablet</option>
                        <option>Hair Lepa</option>
                    </select>

                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="input h-24"
                    />

                    <div className="flex gap-3 mt-4">
                        <button onClick={editId ? updateProduct : addProduct} className="btn-primary">
                            {editId ? "Update" : "Add"}
                        </button>

                        {editId && (
                            <button onClick={resetForm} className="btn-secondary">
                                Cancel
                            </button>
                        )}
                    </div>

                    {message && (
                        <p className="text-green-500 mt-3 text-sm">{message}</p>
                    )}

                </div>


                {/* ===== PRODUCTS ===== */}
                <div className="lg:col-span-2 flex flex-col">

                    {/* SEARCH + FILTER */}
                    <div className="card flex gap-4 mb-6 items-center w-full">

                        <input
                            placeholder="Search product..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input !mb-0 w-48"
                        />

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="input w-52 !mb-0"
                        >
                            <option value="all">All Categories</option>
                            <option>Hair Oil</option>
                            <option>Hair Tablet</option>
                            <option>Hair Lepa</option>
                        </select>

                    </div>


                    {/* LIST */}
                    <div className="grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto no-scrollbar pr-2">

                        {filteredProducts.map((p) => (

                            <div key={p._id} className="product-card">

                                {/* IMAGE */}
                                <div className="relative">
                                    <img
                                        src={p.image}
                                        className="w-full h-44 object-cover rounded-xl"
                                    />

                                    {p.discount > 0 && (
                                        <span className="discount-badge">
                                            -{p.discount}%
                                        </span>
                                    )}
                                </div>

                                {/* CONTENT */}
                                <div className="mt-4">

                                    <h3 className="font-semibold text-lg">{p.name}</h3>

                                    <div className="flex justify-between mt-2 items-center">
                                        <Price p={p} />
                                        <StockBadge stock={p.stock} />
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button onClick={() => startEdit(p)} className="btn-edit">
                                            Edit
                                        </button>

                                        <button onClick={() => handleDelete(p._id)} className="btn-delete">
                                            Delete
                                        </button>
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </div>
        </div>
    );
}


// ===== COMPONENTS =====

function Input({ value, set, placeholder, type = "text" }) {
    return (
        <input
            type={type}
            value={value}
            onChange={(e) => set(e.target.value)}
            placeholder={placeholder}
            className="input"
        />
    );
}

function Price({ p }) {
    if (p.discount > 0) {
        return (
            <div>
                <p className="text-gray-400 line-through text-sm">₹{p.price}</p>
                <p className="text-[#6B8E23] font-bold">
                    ₹{Math.round(p.price - (p.price * p.discount) / 100)}
                </p>
            </div>
        );
    }
    return <p className="text-[#6B8E23] font-bold">₹{p.price}</p>;
}

function StockBadge({ stock }) {

    let style = "bg-green-600";
    let text = "In Stock";

    if (stock === 0) {
        style = "bg-red-600";
        text = "Out of Stock";
    } else if (stock < 5) {
        style = "bg-yellow-500";
        text = "Low Stock";
    }

    return (
        <span className={`badge ${style}`}>
            {text}
        </span>
    );
}