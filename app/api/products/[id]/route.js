import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { verifyToken } from "@/lib/auth";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ✅ PREFLIGHT
export async function OPTIONS() {
    return new Response(null, { headers: corsHeaders });
}

// ================= GET =================
// 🔥 PUBLIC
export async function GET(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return new Response(
                JSON.stringify({ message: "Invalid ID format" }),
                { status: 400, headers: corsHeaders }
            );
        }

        const product = await Product.findById(id);

        if (!product) {
            return new Response(
                JSON.stringify({ message: "Product not found" }),
                { status: 404, headers: corsHeaders }
            );
        }

        return new Response(JSON.stringify(product), {
            headers: corsHeaders,
        });

    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: error.message }),
            { status: 500, headers: corsHeaders }
        );
    }
}

// ================= PUT =================
// 🔥 ADMIN ONLY
export async function PUT(req, context) {
    try {
        await connectDB();

        // 🔐 JWT VERIFY
        const { user, error } = verifyToken(req);

        if (error) {
            return new Response(
                JSON.stringify({ message: error }),
                { status: 401, headers: corsHeaders }
            );
        }

        if (user.role !== "admin") {
            return new Response(
                JSON.stringify({ message: "Forbidden. Admin only." }),
                { status: 403, headers: corsHeaders }
            );
        }

        const { id } = await context.params;
        const body = await req.json();

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name: body.name,
                description: body.description,
                price: Number(body.price),
                image: body.image,
                category: body.category,
                stock: Number(body.stock),
                discount: Number(body.discount) || 0,
            },
            { new: true }
        );

        return new Response(
            JSON.stringify({
                message: "Product updated successfully",
                product: updatedProduct,
            }),
            { headers: corsHeaders }
        );

    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: "Server error" }),
            { status: 500, headers: corsHeaders }
        );
    }
}

// ================= DELETE =================
// 🔥 ADMIN ONLY
export async function DELETE(req, context) {
    try {
        await connectDB();

        // 🔐 JWT VERIFY
        const { user, error } = verifyToken(req);

        if (error) {
            return new Response(
                JSON.stringify({ message: error }),
                { status: 401, headers: corsHeaders }
            );
        }

        if (user.role !== "admin") {
            return new Response(
                JSON.stringify({ message: "Forbidden. Admin only." }),
                { status: 403, headers: corsHeaders }
            );
        }

        const { id } = await context.params;

        await Product.findByIdAndDelete(id);

        return new Response(
            JSON.stringify({
                message: "Product deleted successfully",
            }),
            { headers: corsHeaders }
        );

    } catch (error) {
        console.log("DELETE ERROR:", error);
        return new Response(
            JSON.stringify({ message: error.message }),
            { status: 500, headers: corsHeaders }
        );
    }
}