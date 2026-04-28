"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {
    const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

    const router = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");

    // ===== AUTH =====
    useEffect(() => {

        const role = localStorage.getItem("userRole");
        const userName = localStorage.getItem("userName");

        if (!role) {
            router.replace("/");
            return;
        }

        if (role !== "admin") {
            router.replace("/");
            return;
        }

        setName(userName || "Admin");
        setLoading(false);

    }, []);

    // ===== LOADER =====
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0B0F0E]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#6B8E23] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#6B8E23] text-sm">Loading Admin Panel...</p>
                </div>
            </div>
        );
    }

    const navItems = [
        { name: "Dashboard", href: "/admin" },
        { name: "Products", href: "/admin/products" },
        { name: "Orders", href: "/admin/orders" },
        { name: "Coupons", href: "/admin/coupons" },
        { name: "Users", href: "/admin/users" },
        { name: "Blogs", href: "/admin/blog" },
        { name: "Reviews", href: "/admin/reviews" },
    ];

    return (
        <div className="h-screen flex bg-gradient-to-br from-[#0B0F0E] to-[#0f1a16] text-white">

            {/* ===== SIDEBAR ===== */}
            <aside className="w-72 flex flex-col bg-[#111815]/80 backdrop-blur-2xl border-r border-[#1E2A24] shadow-2xl">

                {/* LOGO */}
                <div className="p-6 border-b border-[#1E2A24]">
                    <h2 className="text-3xl font-extrabold text-[#6B8E23] tracking-wide">
                        MED<span className="text-white">TECH</span>
                    </h2>
                </div>

                {/* USER */}
                <div className="p-6 border-b border-[#1E2A24]">

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-[#6B8E23] text-black flex items-center justify-center font-bold text-lg shadow">
                            {name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <p className="font-semibold">{name}</p>
                            <p className="text-xs text-gray-400">Administrator</p>
                        </div>

                    </div>

                </div>

                {/* NAV */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">

                    {navItems.map((item) => {

                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                                ${active
                                        ? "bg-[#6B8E23] text-black font-semibold shadow-lg"
                                        : "text-gray-300 hover:bg-[#1A2620]"
                                    }`}
                            >
                                <span className="flex-1">{item.name}</span>

                                {/* Active dot */}
                                {active && (
                                    <span className="w-2 h-2 bg-black rounded-full"></span>
                                )}
                            </Link>
                        );
                    })}

                </div>

                {/* FOOTER */}
                <div className="p-5 border-t border-[#1E2A24] space-y-3">

                    {/* GO TO SITE */}
                    <button
                        onClick={() => window.open(FRONTEND_URL, "_blank")}
                        className="w-full bg-[#6B8E23] text-black py-3 rounded-xl font-semibold hover:scale-[1.02] transition shadow"
                    >
                        🌐 Go to Website
                    </button>

                    {/* LOGOUT */}
                    <button
                        onClick={() => {
                            localStorage.clear();
                            router.replace("/");
                        }}
                        className="w-full border border-[#6B8E23] py-3 rounded-xl text-[#6B8E23] hover:bg-[#6B8E23] hover:text-black transition"
                    >
                        Logout
                    </button>

                </div>

            </aside>

            {/* ===== MAIN ===== */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <header className="h-20 flex items-center justify-between px-8 border-b border-[#1E2A24] bg-[#0F1412]/80 backdrop-blur-xl">

                    <div>
                        <h1 className="text-xl font-semibold">
                            Admin Dashboard
                        </h1>
                        <p className="text-xs text-gray-500">
                            Manage your platform efficiently
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        {/* STATUS DOT */}
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Online
                        </div>

                        {/* USER */}
                        <div className="text-sm">
                            Welcome{" "}
                            <span className="text-[#6B8E23] font-semibold">
                                {name}
                            </span>
                        </div>

                    </div>

                </header>

                {/* CONTENT */}
                <main className="flex-1 p-6 overflow-y-auto no-scrollbar">

                    {/* PAGE WRAPPER */}
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>

                </main>

            </div>

        </div>
    );
}