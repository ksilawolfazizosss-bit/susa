"use server";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import { redirect } from "next/navigation";
import { z } from "zod";

const orderSchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    phone: z.string().min(1, "Phone number is required."),
    productId: z.string(),
});


export async function createOrder(prevState: any, formData: FormData) {
  const validatedFields = orderSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    productId: formData.get("productId"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors[Object.keys(validatedFields.error.flatten().fieldErrors)[0]][0],
      success: false,
    };
  }

  const { firstName, lastName, phone, productId } = validatedFields.data;

  const product = PlaceHolderImages.find(p => p.id === productId);

  if (!product) {
    return { message: "Product not found.", success: false };
  }

  // In a real app, you would save this to a database
  console.log("--- NEW ORDER ---");
  console.log("Customer:", `${firstName} ${lastName}`);
  console.log("Phone:", phone);
  console.log("Product:", product.name);
  console.log("Price:", product.price);
  console.log("Date:", new Date().toISOString());
  console.log("--- END ORDER ---");

  // In a real app, you would send an email notification here
  // await sendOrderEmail({ ... });

  redirect("/order-confirmation");
}
