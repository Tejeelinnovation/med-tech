import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

// DELETE
export async function DELETE(req, { params }) {
    await connectDB();

    const { id } = await params;

    await Review.findByIdAndDelete(id);

    return Response.json({ message: "Deleted" });
}

// UPDATE
export async function PUT(req, { params }) {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const updated = await Review.findByIdAndUpdate(
        id,
        body,
        { returnDocument: "after" }
    );

    return Response.json(updated);
}