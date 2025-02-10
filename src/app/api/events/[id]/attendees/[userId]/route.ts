import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const headersList = headers();
    const token = headersList.get("authorization");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${params.id}/attendees/${params.userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: token || "",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to remove attendee" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error removing attendee:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 