import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

// ✅ GET ALL BLOGS
export async function GET() {
    try {
        await connectDB();

        const blogs = await Blog.find().sort({ createdAt: -1 });

        return Response.json(blogs);
    } catch (err) {
        console.error("GET BLOG ERROR:", err);
        return Response.json(
            { message: "Failed to fetch blogs" },
            { status: 500 }
        );
    }
}


// ✅ CREATE BLOG
export async function POST(req) {
    try {
        await connectDB();

        const { title, content, image } = await req.json();

        // ✅ validation
        if (!title || !content || !image) {
            return Response.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const blog = await Blog.create({
            title,
            content,
            image,
        });

        return Response.json(blog, { status: 201 });

    } catch (err) {
        console.error("POST BLOG ERROR:", err);
        return Response.json(
            { message: "Failed to create blog" },
            { status: 500 }
        );
    }
}