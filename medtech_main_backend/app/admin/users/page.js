"use client";

import { useEffect, useState } from "react";

export default function UsersPage() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 6;

    // ===== LOAD USERS =====
    const loadUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();

            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setUsers([]);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // ===== FILTER =====
    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
    );

    // ===== PAGINATION =====
    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // ===== STATS =====
    const totalUsers = users.length;

    return (
        <div className="space-y-10">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5">

                <h1 className="text-4xl font-bold text-[#6B8E23]">
                    Users Management
                </h1>

                <div className="bg-[#1A1A1A] border border-[#222] px-6 py-3 rounded-xl shadow-lg">
                    <p className="text-sm text-gray-400">Total Users</p>
                    <h2 className="text-2xl font-bold text-[#6B8E23]">{totalUsers}</h2>
                </div>

            </div>

            {/* SEARCH */}
            <div className="card flex items-center gap-3">

                <input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="flex-1 p-3 rounded-xl bg-[#1A1A1A] border border-[#222] focus:outline-none focus:border-[#6B8E23]"
                />

            </div>

            {/* TABLE */}
            <div className="card overflow-hidden">

                {/* HEADER */}
                <div className="grid grid-cols-4 px-6 py-4 bg-[#6B8E23] text-black text-sm font-semibold">
                    <span>#</span>
                    <span>Name</span>
                    <span>Email</span>
                    <span className="text-center">Joined</span>
                </div>

                {/* BODY */}
                <div className="divide-y divide-[#222]">

                    {currentUsers.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            No users found.
                        </div>
                    ) : (
                        currentUsers.map((user, index) => (
                            <div
                                key={user._id}
                                className="grid grid-cols-4 px-6 py-4 items-center hover:bg-[#1A1A1A]/60 transition"
                            >
                                <span className="text-gray-400">
                                    {indexOfFirst + index + 1}
                                </span>

                                <span className="font-semibold">
                                    {user.name || "N/A"}
                                </span>

                                <span className="text-gray-400">
                                    {user.email || "N/A"}
                                </span>

                                <span className="text-center text-gray-400 text-sm">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString()
                                        : "-"}
                                </span>
                            </div>
                        ))
                    )}

                </div>

            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 flex-wrap">

                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#333] disabled:opacity-40"
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded-lg text-sm ${currentPage === i + 1
                                ? "bg-[#6B8E23] text-black"
                                : "bg-[#1A1A1A] hover:bg-[#333]"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#333] disabled:opacity-40"
                    >
                        Next
                    </button>

                </div>
            )}

        </div>
    );
}