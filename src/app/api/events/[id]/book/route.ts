import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = headers();
    const token = (await headersList).get("authorization");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.id}/book`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Booking failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = headers();
    const token = headersList.get("authorization");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.id}/book`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Unbooking failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("DELETE /api/events/[id]/book error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
