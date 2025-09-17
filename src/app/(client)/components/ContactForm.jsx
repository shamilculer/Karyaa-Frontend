"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Textarea } from "@/components/ui/textarea"; // make sure you have this component

// ✅ Schema
const contactFormSchema = z.object({
  fullname: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

const ContactForm = () => {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onFormSubmit(data) {
    console.log("Form submitted with data:", data);
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onFormSubmit)}
          className="space-y-6"
        >
          {/* Full Name */}
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem> 
                <FormLabel className="text-lg font-semibold">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" className="py-5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6">


            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                    className="py-5"
                      type="email"
                      placeholder="Enter your email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Phone</FormLabel>
                  <FormControl>
                    <Input
                    className="py-5"
                      type="tel"
                      placeholder="Enter your phone number (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>

          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Message</FormLabel>
                <FormControl>
                  <Textarea
                    rows={20}
                    placeholder="Write your message here..."
                    {...field}
                    className="min-h-32"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactForm;
