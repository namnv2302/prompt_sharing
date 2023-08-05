import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

const GET = async (req: Request, { params }: any) => {
  try {
    await connectToDB();
    const prompts = await Prompt.find({ creator: params.id })
      .sort({ createdAt: "desc" })
      .populate("creator");
    return new Response(JSON.stringify(prompts), {
      status: 200,
    });
  } catch (error: any) {
    console.log(error.message);
    return new Response("Failed to fetch prompts", {
      status: 500,
    });
  }
};

export { GET };
