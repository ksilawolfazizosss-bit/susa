'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeProductImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A product photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type OptimizeProductImageInput = z.infer<
  typeof OptimizeProductImageInputSchema
>;

const OptimizeProductImageOutputSchema = z.object({
  optimizedImageDataUri: z
    .string()
    .describe('The optimized product photo as a data URI.'),
});

export type OptimizeProductImageOutput = z.infer<
  typeof OptimizeProductImageOutputSchema
>;

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
  async input => {
    // Note: Using a vision model to "optimize" an image like this is not standard practice.
    // A dedicated image processing library would be more reliable and efficient.
    // However, this is implemented based on the user's request context for a "magic" solution.
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image', // Use the correct image-to-image model
      prompt: [
        {
          media: {url: input.imageDataUri},
        },
        {
          text: 'You are an expert at optimizing images for web stores. This is a product photo for an e-commerce website. Please optimize and compress the image for web use. Return a high quality JPEG image. The image should be no larger than 1200px on its longest side. The final file size should be significantly smaller but quality should be preserved.',
        },
      ],
      config: {
        responseModalities: ['IMAGE', 'TEXT'], // Both are required for this model
      },
    });

    if (!media?.url) {
      throw new Error('Image optimization failed. The model did not return an image.');
    }

    return {
      optimizedImageDataUri: media.url,
    };
  }
);
