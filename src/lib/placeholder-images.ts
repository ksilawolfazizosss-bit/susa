import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  type: 'product' | 'gallery';
  description: string;
  imageUrl: string;
  imageHint: string;
  name?: string;
  price?: number;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
