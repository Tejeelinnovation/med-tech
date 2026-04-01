import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// ✅ CORS HEADERS
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

// ✅ OPTIONS (important for CORS)
export async function OPTIONS() {
    return new Response(null, {
        headers: corsHeaders
    });
}

// ✅ LOGIN API
export async function POST(req) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        // validation
        if (!email || !password) {
            return new Response(
                JSON.stringify({ message: "All fields are required" }),
                { status: 400, headers: corsHeaders }
            );
        }

        // check user
        const user = await User.findOne({ email });

        if (!user) {
            return new Response(
                JSON.stringify({ message: "User not found" }),
                { status: 404, headers: corsHeaders }
            );
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return new Response(
                JSON.stringify({ message: "Invalid credentials" }),
                { status: 401, headers: corsHeaders }
            );
        }

        // success response
        return new Response(
            JSON.stringify({
                message: "Login successful ✅",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }),
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        console.error(error);

        return new Response(
            JSON.stringify({ message: "Server error" }),
            { status: 500, headers: corsHeaders }
        );
    }
}