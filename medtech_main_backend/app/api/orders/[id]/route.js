import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const { email, status } = await req.json();

        if (!email || !status) {
            return Response.json(
                { message: "Email and status required" },
                { status: 400 }
            );
        }

        // ✅ status validation
        const validStatus = ["pending", "approved", "shipped", "delivered", "cancelled"];

        if (!validStatus.includes(status)) {
            return Response.json(
                { message: "Invalid status value" },
                { status: 400 }
            );
        }

        // ✅ admin check
        const user = await User.findOne({ email });

        if (!user || user.role !== "admin") {
            return Response.json(
                { message: "Unauthorized. Admin only." },
                { status: 403 }
            );
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { returnDocument: "after" }
        );

        if (!updatedOrder) {
            return Response.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        return Response.json({
            message: "Order status updated successfully",
            order: updatedOrder,
        });

    } catch (error) {
        console.error("ORDER UPDATE ERROR:", error);

        return Response.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}