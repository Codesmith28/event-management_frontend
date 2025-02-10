export async function getEvent(id: string) {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("API_URL is not defined");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch event");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
} 