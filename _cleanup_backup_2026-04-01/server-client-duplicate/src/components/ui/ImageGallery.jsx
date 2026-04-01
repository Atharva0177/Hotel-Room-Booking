import { useState } from 'react';

export const ImageGallery = ({ images = [] }) => {
  const [active, setActive] = useState(images[0]);

  if (!images.length) return null;

  return (
    <div className="space-y-3">
      <img
        src={active}
        alt="Room visual"
        className="w-full aspect-[16/10] lg:aspect-[3/2] lg:max-h-[620px] rounded-xl object-cover"
        loading="lazy"
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((image) => (
          <button key={image} onClick={() => setActive(image)} className="overflow-hidden rounded-md">
            <img
              src={image}
              alt="Thumbnail"
              className="w-full aspect-[4/3] rounded-md object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
