"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewsAdmin() {

    const router = useRouter();

    const [reviews, setReviews] = useState([]);

    const [name, setName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [product, setProduct] = useState("");

    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ AUTH CHECK
    useEffect(() => {
        const role = localStorage.getItem("userRole");
        const token = localStorage.getItem("token");

        if (!token || role !== "admin") {
            router.replace("/");
            return;
        }

        loadReviews();
    }, []);

    // ===== LOAD =====
    const loadReviews = async () => {
        try {
            const res = await fetch("/api/reviews", {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });

            const data = await res.json();
            setReviews(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Load error:", err);
        }
    };

    // ===== SUBMIT =====
    const handleSubmit = async () => {

        if (!name.trim() || !comment.trim()) {
            alert("Please fill required fields ❌");
            return;
        }

        setLoading(true);

        try {

            const payload = {
                name: name.trim(),
                rating,
                comment: comment.trim(),
                product: product.trim()
            };

            const method = editId ? "PUT" : "POST";
            const url = editId ? `/api/reviews/${editId}` : "/api/reviews";

            await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token")
                },
                body: JSON.stringify(payload)
            });

            await loadReviews();

            // reset
            setName("");
            setRating(5);
            setComment("");
            setProduct("");
            setEditId(null);

        } catch (err) {
            console.error("Submit error:", err);
        }

        setLoading(false);
    };

    // ===== DELETE =====
    const deleteReview = async (id) => {

        if (!confirm("Delete this review?")) return;

        try {
            await fetch(`/api/reviews/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });

            setReviews(prev => prev.filter(r => r._id !== id));

        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    // ===== EDIT =====
    const editReview = (review) => {

        setName(review.name || "");
        setRating(review.rating || 5);
        setComment(review.comment || "");
        setProduct(review.product || "");
        setEditId(review._id);

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ===== STARS =====
    const renderStars = (value, clickable = false, setFunc = null) => {
        return [...Array(5)].map((_, i) => (
            <span
                key={i}
                onClick={() => clickable && setFunc(i + 1)}
                className={`cursor-pointer text-xl transition ${i < value ? "text-yellow-400" : "text-gray-600"
                    }`}
            >
                ★
            </span>
        ));
    };

    // ===== STATS =====
    const totalReviews = reviews.length;
    const avgRating =
        reviews.length > 0
            ? (
                reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                reviews.length
            ).toFixed(1)
            : 0;

    return (
        <div className="space-y-10">

            {/* HEADER */}
            <div className="flex justify-between items-center flex-wrap gap-4">

                <h1 className="text-4xl font-bold text-[#6B8E23]">
                    Reviews Management
                </h1>

                <div className="flex gap-4">
                    <StatCard title="Total Reviews" value={totalReviews} />
                    <StatCard title="Avg Rating" value={`⭐ ${avgRating}`} />
                </div>

            </div>

            {/* FORM */}
            <div className="card max-w-2xl">

                <h2 className="text-2xl font-semibold mb-6 text-[#6B8E23]">
                    {editId ? "Edit Review" : "Add Review"}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                    <input
                        placeholder="Customer Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input"
                    />

                    <input
                        placeholder="Product (optional)"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                        className="input"
                    />

                </div>

                {/* ⭐ RATING */}
                <div className="mt-5">
                    <p className="text-sm text-gray-400 mb-2">Rating</p>
                    <div className="flex gap-1">
                        {renderStars(rating, true, setRating)}
                    </div>
                </div>

                <textarea
                    placeholder="Write review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input mt-4 min-h-[100px]"
                />

                <div className="flex gap-4 mt-6">

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading
                            ? "Saving..."
                            : editId
                                ? "Update Review"
                                : "Add Review"}
                    </button>

                    {editId && (
                        <button
                            onClick={() => {
                                setEditId(null);
                                setName("");
                                setRating(5);
                                setComment("");
                                setProduct("");
                            }}
                            className="text-gray-400 underline"
                        >
                            Cancel
                        </button>
                    )}

                </div>

            </div>

            {/* LIST */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {reviews.map((review) => (

                    <div
                        key={review._id}
                        className="bg-[#1A1A1A]/80 backdrop-blur-xl p-5 rounded-2xl border border-[#222] hover:scale-[1.02] transition"
                    >

                        <div className="flex justify-between items-start">

                            <div>
                                <h3 className="text-lg font-bold text-[#6B8E23]">
                                    {review.name}
                                </h3>

                                <p className="text-xs text-gray-400">
                                    {review.product || "General Review"}
                                </p>
                            </div>

                            <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>

                        </div>

                        {/* STARS */}
                        <div className="mt-2">
                            {renderStars(review.rating)}
                        </div>

                        <p className="text-sm text-gray-300 mt-3 line-clamp-3">
                            {review.comment}
                        </p>

                        {/* ACTIONS */}
                        <div className="flex gap-3 mt-5">

                            <button
                                onClick={() => editReview(review)}
                                className="btn-blue"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => deleteReview(review._id)}
                                className="btn-red"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

// STAT CARD
function StatCard({ title, value }) {
    return (
        <div className="bg-[#1A1A1A]/80 backdrop-blur-xl p-5 rounded-2xl border border-[#222] shadow-lg min-w-[120px]">
            <p className="text-xs text-gray-400">{title}</p>
            <h2 className="text-xl font-bold text-[#6B8E23] mt-1">{value}</h2>
        </div>
    );
}