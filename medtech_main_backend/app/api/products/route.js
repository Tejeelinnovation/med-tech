import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextResponse } from "next/server";


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

export async function OPTIONS() {
    return new Response(null, {
        headers: corsHeaders
    });
}
export async function GET() {
    try {
        await connectDB();

        const products = await Product.find();

        return NextResponse.json(products, {
            headers: corsHeaders
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            {
                status: 500,
                headers: corsHeaders
            }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();

        const {
            email,
            name,
            category,
            description,
            price,
            stock,
            prescriptionRequired,
            image,
        } = await req.json();

        const user = await User.findOne({ email });

        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { message: "Unauthorized. Admin only." },
                {
                    status: 403,
                    headers: corsHeaders
                }
            );
        }

        const product = await Product.create({
            name,
            category,
            description,
            price,
            stock,
            prescriptionRequired,
            image,
        });

        return NextResponse.json({
            message: "Product created successfully",
            product,
        }, {
            headers: corsHeaders
        });

    } catch (error) {
        return NextResponse.json(
            { message: "Server error" },
            {
                status: 500,
                headers: corsHeaders
            }
        );
    }
}