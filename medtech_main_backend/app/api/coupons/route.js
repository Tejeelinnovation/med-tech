import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import User from "@/models/User";

// ================= GET =================
export async function GET() {
    try {
        await connectDB();

        const coupons = await Coupon.find().sort({ createdAt: -1 });

        return Response.json(coupons);
    } catch (error) {
        console.error("GET COUPON ERROR:", error);

        return Response.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}


// ================= POST =================
export async function POST(req) {
    try {
        await connectDB();

        const { email, code, discountPercent, expiryDate } = await req.json();

        // ✅ validation
        if (!email || !code || !discountPercent || !expiryDate) {
            return Response.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // ✅ normalize code
        const normalizedCode = code.toUpperCase();

        // ✅ admin check
        const user = await User.findOne({ email });

        if (!user || user.role !== "admin") {
            return Response.json(
                { message: "Unauthorized. Admin only." },
                { status: 403 }
            );
        }

        // ✅ duplicate check
        const existingCoupon = await Coupon.findOne({ code: normalizedCode });

        if (existingCoupon) {
            return Response.json(
                { message: "Coupon already exists" },
                { status: 400 }
            );
        }

        // ✅ expiry validation
        if (new Date(expiryDate) <= new Date()) {
            return Response.json(
                { message: "Expiry must be in future" },
                { status: 400 }
            );
        }

        const coupon = await Coupon.create({
            code: normalizedCode,
            discountPercent: Number(discountPercent),
            expiryDate,
        });

        return Response.json({
            message: "Coupon created successfully",
            coupon,
        });

    } catch (error) {
        console.error("CREATE COUPON ERROR:", error);

        return Response.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}