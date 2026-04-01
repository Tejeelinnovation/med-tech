import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";

// ================= POST =================
export async function POST(req) {

    try {

        await connectDB();

        const { userEmail, products, couponCode } = await req.json();

        if (!userEmail || !products?.length) {
            return Response.json(
                { message: "Invalid data" },
                { status: 400 }
            );
        }

        let totalAmount = 0;
        let requiresPrescription = false;

        const enrichedProducts = [];

        for (let item of products) {

            const product = await Product.findById(item.productId);

            if (!product) {
                return Response.json(
                    { message: "Product not found" },
                    { status: 404 }
                );
            }

            totalAmount += product.price * item.quantity;

            if (product.prescriptionRequired) {
                requiresPrescription = true;
            }

            // ✅ SNAPSHOT SAVE
            enrichedProducts.push({
                productId: product._id,
                quantity: Number(item.quantity) || 1,
                name: product.name,
                price: Number(product.price),
                image: product.image
            });
        }

        // ===== COUPON =====
        if (couponCode) {

            const coupon = await Coupon.findOne({ code: couponCode });

            if (!coupon) {
                return Response.json(
                    { message: "Invalid coupon code" },
                    { status: 400 }
                );
            }

            if (new Date(coupon.expiryDate) < new Date()) {
                return Response.json(
                    { message: "Coupon expired" },
                    { status: 400 }
                );
            }

            const discountAmount =
                (totalAmount * coupon.discountPercent) / 100;

            totalAmount -= discountAmount;
        }

        const order = await Order.create({
            userEmail,
            products: enrichedProducts,
            totalAmount,
            status: requiresPrescription
                ? "waiting_for_prescription"
                : "pending",
        });

        return Response.json({
            message: "Order placed successfully",
            order,
        });

    } catch (error) {
        console.error("ORDER CREATE ERROR:", error);

        return Response.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}


// ================= GET =================
export async function GET() {

    try {

        await connectDB();

        const orders = await Order.find()
            .sort({ createdAt: -1 });

        return Response.json(orders);

    } catch (error) {
        console.error("ORDER FETCH ERROR:", error);

        return Response.json(
            { message: "Server error" },
            { status: 500 }
        );
    }
}