import connectDB from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import User from "@/models/User";


// ===== UPDATE COUPON =====
export async function PUT(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;

        const { email, code, discountPercent, expiryDate } = await req.json();

        // ✅ validation
        if (!email || !discountPercent || !expiryDate) {
            return Response.json(
                { message: "All fields required" },
                { status: 400 }
            );
        }

        // ✅ expiry check
        if (new Date(expiryDate) <= new Date()) {
            return Response.json(
                { message: "Expiry must be future date" },
                { status: 400 }
            );
        }

        // ✅ admin check
        const user = await User.findOne({ email });

        if (!user || user.role !== "admin") {
            return Response.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(
            id,
            {
                code: code.toUpperCase(),
                discountPercent: Number(discountPercent),
                expiryDate
            },
            { returnDocument: "after" }
        );

        if (!updatedCoupon) {
            return Response.json(
                { message: "Coupon not found" },
                { status: 404 }
            );
        }

        return Response.json({
            message: "Coupon updated successfully",
            coupon: updatedCoupon,
        });

    } catch (error) {
        console.error("UPDATE COUPON ERROR:", error);

        return Response.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}


// ===== DELETE COUPON =====
export async function DELETE(req, context) {
    try {
        await connectDB();

        const { id } = await context.params;

        const { email } = await req.json();

        if (!email) {
            return Response.json(
                { message: "Email required" },
                { status: 400 }
            );
        }

        // ✅ admin check
        const user = await User.findOne({ email });

        if (!user || user.role !== "admin") {
            return Response.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const deletedCoupon = await Coupon.findByIdAndDelete(id);

        if (!deletedCoupon) {
            return Response.json(
                { message: "Coupon not found" },
                { status: 404 }
            );
        }

        return Response.json({
            message: "Coupon deleted successfully",
        });

    } catch (error) {
        console.error("DELETE COUPON ERROR:", error);

        return Response.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}