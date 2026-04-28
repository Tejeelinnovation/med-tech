import connectDB from "@/lib/mongodb";
import Cart from "@/models/Cart";

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

export async function POST(req) {
    await connectDB();

    const { email, productId, action } = await req.json();

    const cart = await Cart.findOne({ userEmail: email });

    if (!cart) {
        return new Response(JSON.stringify({ message: "Cart not found" }), {
            headers: corsHeaders
        });
    }

    const item = cart.items.find(i => i.productId === productId);

    if (item) {
        if (action === "increase") item.quantity += 1;
        if (action === "decrease") item.quantity -= 1;
    }

    cart.items = cart.items.filter(i => i.quantity > 0);

    await cart.save();

    return new Response(JSON.stringify({ message: "Updated" }), {
        headers: corsHeaders
    });
}