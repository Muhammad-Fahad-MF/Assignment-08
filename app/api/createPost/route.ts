import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Send data to Sanity
    const sanityResponse = await fetch(
      `https://xxljpk8d.api.sanity.io/v2023-03-01/data/mutate/production2`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SANITY_TOKEN}`,
        },
        body: JSON.stringify({
          mutations: [
            {
              create: {
                _type: "post",
                ...body,
              },
            },
          ],
        }),
      }
    );

    if (!sanityResponse.ok) {
      throw new Error("Failed to create post in Sanity");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
