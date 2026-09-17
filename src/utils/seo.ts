import { imgUrl } from './cloudinary';

interface Photo {
  publicId: string;
  alt: string;
}

export function albumJsonLd(name: string, path: string, photos: Photo[]) {
  const images = photos.slice(0, 6).map(p => ({
    '@type': 'ImageObject',
    contentUrl: imgUrl(p.publicId, 1200),
    ...(p.alt ? { name: p.alt } : {}),
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: `https://photos.reubeningber.com${path}`,
    mainEntity: {
      '@type': 'ImageGallery',
      image: images,
    },
  };
}
