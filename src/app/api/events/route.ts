import { NextResponse } from "next/server";
import { headers } from "next/headers";
import socket from "@/lib/socket";

async function verifyAdminStatus(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const data = await response.json();
    return data.isAdmin === true;
  } catch (error) {
    console.error("Error verifying admin status:", error);
    return false;
  }
}

async function getUserIdFromToken(token: string): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/user`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const data = await response.json();
    return data.userId;
  } catch (error) {
    console.error("Error getting user ID:", error);
    throw new Error("Failed to get user ID");
  }
}

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// This POST route handles the creation of new events by admins only.
export async function POST(request: Request) {
  try {
    const reqHeaders = headers();
    const authToken = (await reqHeaders).get("authorization");

    // Check if user is authenticated and is an admin
    if (!authToken) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const isAdmin = await verifyAdminStatus(authToken);
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, date, location, imageUrl, category } = body;

    const organizer = await getUserIdFromToken(authToken);

    const event = {
      title,
      description,
      date: new Date(date), // convert date string to a Date object
      location,
      imageUrl,
      category,
      organizer,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify(event),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    const savedEvent = await response.json();

    // Emit a socket event after successful creation
    socket.emit("eventCreated", savedEvent);

    return NextResponse.json(savedEvent, { status: 201 });
  } catch (error) {
    console.error("Error in createEvent:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
