import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

// ✅ GET SINGLE BLOG
export async function GET(req, { params }) {
    try {
        await connectDB();

        const { id } = await params; // 🔥 FIX

        const blog = await Blog.findById(id);

        if (!blog) {
            return Response.json({ message: "Not found" }, { status: 404 });
        }

        return Response.json(blog);

    } catch (err) {
        console.error("GET ERROR:", err);
        return Response.json({ message: "Error" }, { status: 500 });
    }
}


// ✅ DELETE BLOG
export async function DELETE(req, { params }) {
    try {
        await connectDB();

        const { id } = await params; // 🔥 FIX

        await Blog.findByIdAndDelete(id);

        return Response.json({ message: "Deleted" });

    } catch (err) {
        console.error("DELETE ERROR:", err);
        return Response.json({ message: "Error" }, { status: 500 });
    }
}


// ✅ UPDATE BLOG
export async function PUT(req, { params }) {
    try {
        await connectDB();

        const { id } = await params; // 🔥 FIX

        const body = await req.json();

        console.log("UPDATE BODY:", body);

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            body,
            { returnDocument: "after" } // 🔥 FIX (no warning)
        );

        return Response.json(updatedBlog);

    } catch (err) {
        console.error("UPDATE ERROR:", err);
        return Response.json(
            { message: err.message },
            { status: 500 }
        );
    }
}