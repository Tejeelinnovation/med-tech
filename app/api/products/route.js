import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ PREFLIGHT
export async function OPTIONS() {
    return new Response(null, {
        headers: corsHeaders,
    });
}

// ================= GET =================
// 🔥 PUBLIC (sab dekh sakte)
export async function GET() {
    try {
        await connectDB();

        const products = await Product.find();

        return NextResponse.json(products, {
            headers: corsHeaders,
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            {
                status: 500,
                headers: corsHeaders,
            }
        );
    }
}

// ================= POST =================
// 🔥 ADMIN ONLY
export async function POST(req) {
    try {
        await connectDB();

        // 🔥 JWT VERIFY
        const { user, error } = verifyToken(req);

        if (error) {
            return NextResponse.json(
                { message: error },
                { status: 401, headers: corsHeaders }
            );
        }

        // 🔥 ADMIN CHECK
        if (user.role !== "admin") {
            return NextResponse.json(
                { message: "Forbidden. Admin only." },
                { status: 403, headers: corsHeaders }
            );
        }

        const {
            name,
            category,
            description,
            price,
            stock,
            prescriptionRequired,
            image,
        } = await req.json();

        const product = await Product.create({
            name,
            category,
            description,
            price,
            stock,
            prescriptionRequired,
            image,
        });

        return NextResponse.json(
            {
                message: "Product created successfully",
                product,
            },
            {
                headers: corsHeaders,
            }
        );

    } catch (error) {
        console.error("PRODUCT CREATE ERROR:", error);

        return NextResponse.json(
            { message: "Server error" },
            {
                status: 500,
                headers: corsHeaders,
            }
        );
    }
}