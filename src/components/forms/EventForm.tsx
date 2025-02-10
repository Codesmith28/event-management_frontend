"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Event } from "@/types";
import { CldUploadButton } from 'next-cloudinary';
import { useState } from "react";
import socket from "@/lib/socket";

const eventSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string(),
  time: z.string(),
  location: z.string().min(2, "Location must be at least 2 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  seatsTotal: z.number().min(1, "Total seats must be at least 1"),
  imageUrl: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  onSuccess?: () => void;
  isEditing?: boolean;
}

export function EventForm({ event, onSuccess, isEditing = false }: EventFormProps) {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string>(event?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      date: event?.date ? new Date(event.date).toISOString().split('T')[0] : "",
      time: event?.time || "12:00",
      location: event?.location || "",
      category: event?.category || "",
      seatsTotal: event?.seatsTotal || 100,
      imageUrl: event?.imageUrl || "",
    },
  });

  const handleImageUpload = (result: any) => {
    if (result.event === "success") {
      const newImageUrl = result.info.secure_url;
      setImageUrl(newImageUrl);
      form.setValue("imageUrl", newImageUrl);
      toast({
        title: "Image uploaded",
        description: "New image has been uploaded successfully",
      });
    }
  };

  async function onSubmit(data: EventFormValues) {
    try {
      const url = isEditing ? `/api/events/${event?._id}` : "/api/events";
      const method = isEditing ? "PUT" : "POST";

      const eventData = {
        ...data,
        imageUrl: imageUrl || data.imageUrl,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save event");
      }

      const savedEvent = await response.json();

      toast({
        title: isEditing ? "Event Updated" : "Event Created",
        description: isEditing 
          ? "Your event has been updated successfully."
          : "Your event has been created successfully.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save event",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="max-w-sm">
                  <FormLabel className="font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="max-w-sm">
                  <FormLabel className="font-semibold">Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="max-w-sm">
                  <FormLabel className="font-semibold">Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="max-w-sm">
                  <FormLabel className="font-semibold">Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Event Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="max-w-sm">
                  <FormLabel className="font-semibold">Category</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Select Category</option>
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="networking">Networking</option>
                      <option value="other">Other</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seatsTotal"
              render={({ field }) => (
                <FormItem className="max-w-sm">
                  <FormLabel className="font-semibold">Total Seats</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Total Seats" 
                      {...field} 
                      className="w-full"
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="max-w-sm">
                  <FormLabel className="font-semibold">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Event Description" 
                      {...field} 
                      className="w-full min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Event Image {isEditing ? "(Upload new to replace)" : "*"}
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {imageUrl && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                          <img
                            src={imageUrl}
                            alt="Event"
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                      )}
                      <CldUploadButton
                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                        onUpload={handleImageUpload}
                        options={{
                          maxFiles: 1,
                          sources: ["local", "url", "camera"],
                          clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
                          maxFileSize: 10000000,
                        }}
                        className="w-full px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {isUploading ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="animate-spin">⏳</span>
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          <span>{imageUrl ? "Replace Image" : "Upload Image"}</span>
                        )}
                      </CldUploadButton>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 pt-3 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (onSuccess) onSuccess();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-8"
            disabled={isUploading}
          >
            {isEditing ? "Save Changes" : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
