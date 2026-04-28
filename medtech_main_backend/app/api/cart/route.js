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
export async function GET(req) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) return new Response(JSON.stringify([]), { headers: corsHeaders });

    const cart = await Cart.findOne({ userEmail: email });

    return new Response(JSON.stringify(cart?.items || []), { headers: corsHeaders });
}
export async function POST(req) {
    await connectDB();

    const { email, item } = await req.json();

    let cart = await Cart.findOne({ userEmail: email });

    if (!cart) {
        cart = await Cart.create({
            userEmail: email,
            items: [{
                productId: item._id,
                name: item.name,
                price: Math.round(
                    item.price - (item.price * (item.discount || 0) / 100)
                ),
                image: item.image,
                quantity: 1
            }]
        });
    } else {
        const existingItem = cart.items.find(
            (i) => i.productId.toString() === item._id.toString()
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                productId: item._id,
                name: item.name,
                price: Math.round(
                    item.price - (item.price * (item.discount || 0) / 100)
                ),
                image: item.image,
                quantity: 1
            });
        }

        await cart.save();
    }

    return new Response(JSON.stringify({ message: "Cart updated" }), {
        headers: corsHeaders
    });
}

export async function DELETE(req) {
    await connectDB();

    const { email } = await req.json();

    await Cart.findOneAndDelete({ userEmail: email });

    return new Response(JSON.stringify({ message: "Cart cleared" }), {
        headers: corsHeaders
    });
}