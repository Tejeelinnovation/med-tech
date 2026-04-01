import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";

import mongoose from "mongoose";


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

export async function OPTIONS() {
    return new Response(null, { headers: corsHeaders });
}
export async function GET(req, context) {
    try {
        await connectDB();

        const params = await context.params;
        const id = params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return new Response(JSON.stringify({ message: "Invalid ID format" }), {
                status: 400,
                headers: corsHeaders
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return new Response(JSON.stringify({ message: "Product not found" }), {
                status: 404,
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify(product), {
            headers: corsHeaders
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: error.message }), {
            status: 500,
            headers: corsHeaders
        });

    }
}
export async function PUT(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;

        const body = await req.json();

        console.log("Incoming stock:", body.stock);

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

        return Response.json({
            message: "Product updated successfully",
            product: updatedProduct,
        });

    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req, context) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return Response.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const params = await context.params;
        const id = params.id;

        await Product.findByIdAndDelete(id);

        return Response.json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.log("DELETE ERROR:", error);
        return Response.json(
            { message: error.message },
            { status: 500 }
        );
    }
}