'use server';
/**
 * @fileOverview A Genkit flow for generating luxurious and detailed product descriptions.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - ProductDescriptionGeneratorInput - The input type for the generateProductDescription function.
 * - ProductDescriptionGeneratorOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductDescriptionGeneratorInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product (e.g., Dress, Handbag, Jewelry).'),
  keyFeatures: z
    .array(z.string())
    .describe('A list of key features or selling points of the product.'),
});
export type ProductDescriptionGeneratorInput = z.infer<typeof ProductDescriptionGeneratorInputSchema>;

const ProductDescriptionGeneratorOutputSchema = z.object({
  description: z.string().describe('The generated luxurious and detailed product description.'),
});
export type ProductDescriptionGeneratorOutput = z.infer<typeof ProductDescriptionGeneratorOutputSchema>;

export async function generateProductDescription(
  input: ProductDescriptionGeneratorInput
): Promise<ProductDescriptionGeneratorOutput> {
  return productDescriptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productDescriptionGeneratorPrompt',
  input: {schema: ProductDescriptionGeneratorInputSchema},
  output: {schema: ProductDescriptionGeneratorOutputSchema},
  prompt: `You are an expert copywriter for a high-end luxury fashion brand named "Susan Fashion".
Your task is to create a luxurious, elegant, and detailed product description.

Product Name: {{{productName}}}
Category: {{{category}}}
Key Features:
{{#each keyFeatures}}- {{{this}}}
{{/each}}

Craft a compelling product description that evokes sophistication, exclusivity, and quality, suitable for a premium fashion item. Focus on the craftsmanship, materials, and the feeling it will give the wearer or owner.`,
});

const productDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'productDescriptionGeneratorFlow',
    inputSchema: ProductDescriptionGeneratorInputSchema,
    outputSchema: ProductDescriptionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
