"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLayout({ children }) {

    const FRONTEND_URL =
        process.env.NEXT_PUBLIC_FRONTEND_URL || "http://127.0.0.1:5500";

    const router = useRouter();
    const pathname = usePathname();

    const [authorized, setAuthorized] = useState(null);
    const [name, setName] = useState("");
    useEffect(() => {
        // sabse pehle ye console me dekho
        console.log("FULL URL:", window.location.href);
        console.log("URL SEARCH:", window.location.search);
        console.log("ALL PARAMS:", Object.fromEntries(new URLSearchParams(window.location.search)));
    }, []);
    useEffect(() => {
        const checkAuth = () => {

            // ✅ FIX 1: Pehle URL params check karo (cross-origin login se aaya hoga)
            const urlParams = new URLSearchParams(window.location.search);
            const urlToken = urlParams.get("token");
            const urlRole = urlParams.get("role");
            const urlName = urlParams.get("name");
            const urlEmail = urlParams.get("email");

            // ✅ Agar URL me token hai to localStorage me save karo
            if (urlToken && urlRole) {
                localStorage.setItem("token", urlToken);
                localStorage.setItem("userRole", urlRole);
                localStorage.setItem("userName", urlName || "Admin");
                localStorage.setItem("userEmail", urlEmail || "");

                // ✅ URL clean karo (token URL me nahi dikhna chahiye)
                window.history.replaceState({}, document.title, "/admin");
            }

            // ✅ Ab localStorage se read karo
            const role = localStorage.getItem("userRole");
            const token = localStorage.getItem("token");
            const userName = localStorage.getItem("userName");

            console.log("ROLE:", role);
            console.log("TOKEN:", token);

            // ✅ No token or role → redirect
            if (!token || !role) {
                setAuthorized(false);
                router.replace("/");
                return;
            }

            // ✅ Not admin → redirect
            if (role !== "admin") {
                setAuthorized(false);
                router.replace("/");
                return;
            }

            // ✅ Token expiry check
            try {
                const parts = token.split(".");
                if (parts.length !== 3) throw new Error("Invalid token");

                const payload = JSON.parse(atob(parts[1]));

                if (!payload.exp || payload.exp * 1000 < Date.now()) {
                    console.warn("Token expired");
                    localStorage.clear();
                    router.replace("/");
                    return;
                }

                // ✅ Role from token bhi verify karo (double check)
                if (payload.role !== "admin") {
                    console.warn("Token role is not admin");
                    localStorage.clear();
                    router.replace("/");
                    return;
                }

            } catch (e) {
                console.error("Token parse error:", e);
                localStorage.clear();
                router.replace("/");
                return;
            }

            // ✅ All good
            setName(userName || "Admin");
            setAuthorized(true);
        };

        // ✅ FIX: 300ms delay — enough time for localStorage to be ready after redirect
        setTimeout(checkAuth, 300);

    }, []);

    // ⏳ LOADING
    if (authorized === null) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0B0F0E]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#6B8E23] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#6B8E23] text-sm">Checking access...</p>
                </div>
            </div>
        );
    }

    // ❌ Not authorized
    if (authorized === false) return null;

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

            {/* SIDEBAR */}
            <aside className="w-72 flex flex-col bg-[#111815]/80 backdrop-blur-2xl border-r border-[#1E2A24] shadow-2xl">

                {/* LOGO */}
                <div className="p-6 border-b border-[#1E2A24]">
                    <h2 className="text-3xl font-extrabold text-[#6B8E23] tracking-wide">
                        MED<span className="text-white">TECH</span>
                    </h2>
                </div>

                {/* USER */}
                <div className="p-6 border-b border-[#1E2A24] flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#6B8E23] text-black flex items-center justify-center font-bold text-lg">
                        {name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                </div>

                {/* NAV */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300
                                ${active
                                        ? "bg-[#6B8E23] text-black font-semibold shadow-lg"
                                        : "text-gray-300 hover:bg-[#1A2620]"
                                    }`}
                            >
                                <span className="flex-1">{item.name}</span>
                                {active && (
                                    <span className="w-2 h-2 bg-black rounded-full"></span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* FOOTER */}
                <div className="p-5 border-t border-[#1E2A24] space-y-3">

                    {/* FRONTEND */}
                    <button
                        onClick={() => window.open(FRONTEND_URL, "_blank")}
                        className="w-full bg-[#6B8E23] text-black py-3 rounded-xl font-semibold hover:scale-[1.02] transition"
                    >
                        🌐 Go to Website
                    </button>

                    {/* LOGOUT */}
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("userRole");
                            localStorage.removeItem("userName");
                            localStorage.removeItem("userEmail");
                            window.location.href = FRONTEND_URL;
                        }}
                        className="w-full border border-[#6B8E23] py-3 rounded-xl text-[#6B8E23] hover:bg-[#6B8E23] hover:text-black transition"
                    >
                        Logout
                    </button>

                </div>
            </aside>

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                {/* HEADER */}
                <header className="h-20 flex items-center justify-between px-8 border-b border-[#1E2A24] bg-[#0F1412]/80 backdrop-blur-xl">
                    <div>
                        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                        <p className="text-xs text-gray-500">Manage your platform efficiently</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Online
                        </div>
                        <div className="text-sm">
                            Welcome{" "}
                            <span className="text-[#6B8E23] font-semibold">{name}</span>
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
}