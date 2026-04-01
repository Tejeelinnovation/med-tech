import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

// GET all reviews
export async function GET() {
    await connectDB();

    const reviews = await Review.find().sort({ createdAt: -1 });

    return Response.json(reviews);
}

// POST review (admin add karega)
export async function POST(req) {
    await connectDB();

    const body = await req.json();

    const review = await Review.create(body);

    return Response.json(review);
}