import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";

export async function POST(req) {
    try {
        await connectDB();

        const { code, subtotal } = await req.json();

        // ✅ validation
        if (!code || !subtotal) {
            return Response.json({
                valid: false,
                message: "Invalid request",
            });
        }

        const normalizedCode = code.toUpperCase();
        const safeSubtotal = Number(subtotal) || 0;

        const coupon = await Coupon.findOne({ code: normalizedCode });

        if (!coupon) {
            return Response.json({
                valid: false,
                message: "Invalid Coupon Code",
            });
        }

        // ✅ expiry check
        const now = new Date();

        if (new Date(coupon.expiryDate) < now) {
            return Response.json({
                valid: false,
                message: "Coupon Expired",
            });
        }

        // ✅ discount calculate
        const discount = Math.round(
            safeSubtotal * (coupon.discountPercent / 100)
        );

        return Response.json({
            valid: true,
            discount,
            message: `${coupon.discountPercent}% Discount Applied`,
        });

    } catch (error) {
        console.error("COUPON VALIDATE ERROR:", error);

        return Response.json({
            valid: false,
            message: "Server Error",
        });
    }
}