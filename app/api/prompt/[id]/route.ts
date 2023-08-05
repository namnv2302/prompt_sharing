import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

const GET = async (req: Request, { params }: any) => {
  try {
    await connectToDB();
    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) {
      return new Response("Prompt not found", {
        status: 404,
      });
    }
    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return new Response("Failed to fetch prompt", {
      status: 500,
    });
  }
};

const PATCH = async (req: Request, { params }: any) => {
  const { prompt, tag } = await req.json();
  try {
    await connectToDB();
    const existing = await Prompt.findById(params.id);
    if (!existing) {
      return new Response("Prompt not found", {
        status: 404,
      });
    }
    existing.prompt = prompt;
    existing.tag = tag;
    existing.updatedAt = Date.now();
    await existing.save();
    return new Response(JSON.stringify(existing), { status: 200 });
  } catch (error: any) {
    console.log(error.message);
    return new Response("Failed to update prompt", {
      status: 500,
    });
  }
};

const DELETE = async (req: Request, { params }: any) => {
  try {
    await connectToDB();
    const deleted = await Prompt.findByIdAndRemove(params.id);
    if (deleted) {
      return new Response("Success to delete prompt", {
        status: 200,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    return new Response("Failed to delete prompt", {
      status: 500,
    });
  }
};

export { GET, PATCH, DELETE };
