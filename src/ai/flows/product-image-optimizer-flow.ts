'use server';
/**
 * @fileOverview This flow handles product image optimization.
 *
 * - optimizeProductImage - A function that optimizes a product image by enhancing its quality and resizing it for e-commerce display.
 * - OptimizeProductImageInput - The input type for the optimizeProductImage function.
 * - OptimizeProductImageOutput - The return type for the optimizeProductImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OptimizeProductImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OptimizeProductImageInput = z.infer<typeof OptimizeProductImageInputSchema>;

const OptimizeProductImageOutputSchema = z.object({
  optimizedPhotoDataUri: z
    .string()
    .describe(
      "The optimized product photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OptimizeProductImageOutput = z.infer<typeof OptimizeProductImageOutputSchema>;

export async function optimizeProductImage(
  input: OptimizeProductImageInput
): Promise<OptimizeProductImageOutput> {
  return optimizeProductImageFlow(input);
}

const optimizeProductImageFlow = ai.defineFlow(
  {
    name: 'optimizeProductImageFlow',
    inputSchema: OptimizeProductImageInputSchema,
    outputSchema: OptimizeProductImageOutputSchema,
  },
  async (input) => {
    // Directly call ai.generate with the specific image-to-image model for optimization.
    // This model allows for both textual instructions and an image input.
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image', // Specify the image-to-image model for quality enhancement and resizing.
      prompt: [
        {
          text: `Enhance the quality of this product image, making it well-lit, sharp, and with a clean, neutral background. Resize and crop the image to fit typical e-commerce website product display requirements, ensuring it's suitable for both a product grid and a detailed product page. Aim for a common aspect ratio like 1:1 or 4:3, making the product centered and prominent.`,
        },
        { media: { url: input.photoDataUri } }, // Pass the input image as a media part.
      ],
      config: {
        // Request both TEXT and IMAGE modalities as required by the model for image generation tasks.
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || media.length === 0 || !media[0].url) {
      throw new Error('Failed to generate an optimized image.');
    }

    // Return the data URI of the first optimized image found in the response.
    return {
      optimizedPhotoDataUri: media[0].url,
    };
  }
);
