export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const MAX_UPLOAD_SIZE_MB = 2;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

// Original file cap before we even attempt compression, just to avoid
// hanging the browser on something absurd (e.g. a 40MB raw photo).
const MAX_ORIGINAL_SIZE_MB = 15;
const MAX_ORIGINAL_SIZE_BYTES = MAX_ORIGINAL_SIZE_MB * 1024 * 1024;

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG or WEBP images are allowed";
  }
  if (file.size > MAX_ORIGINAL_SIZE_BYTES) {
    return `Image is too large. Please select a file under ${MAX_ORIGINAL_SIZE_MB}MB`;
  }
  return null;
};

/**
 * Compresses an image in-browser via canvas until it's under maxSizeBytes,
 * progressively lowering quality (for jpeg/webp) then dimensions.
 * PNGs are kept as PNG (lossless) but still get dimension-shrunk if needed.
 */
export const compressImage = (
  file: File,
  maxSizeBytes: number = MAX_UPLOAD_SIZE_BYTES,
  startDimension: number = 1920
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
      const extension = outputType === "image/png" ? "png" : "jpg";

      const attempt = (dimension: number, quality: number, retriesLeft: number) => {
        let { width, height } = img;
        if (width > dimension || height > dimension) {
          const scale = Math.min(dimension / width, dimension / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("Could not get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              URL.revokeObjectURL(objectUrl);
              reject(new Error("Image compression failed"));
              return;
            }

            const withinLimit = blob.size <= maxSizeBytes;
            const canReduceQuality = outputType !== "image/png" && quality > 0.4;
            const canShrinkDimension = dimension > 640;

            if (withinLimit || retriesLeft <= 0 || (!canReduceQuality && !canShrinkDimension)) {
              URL.revokeObjectURL(objectUrl);
              resolve(
                new File([blob], file.name.replace(/\.[^/.]+$/, `.${extension}`), {
                  type: outputType,
                })
              );
              return;
            }

            if (canReduceQuality) {
              attempt(dimension, quality - 0.15, retriesLeft - 1);
            } else {
              attempt(Math.round(dimension * 0.8), 0.8, retriesLeft - 1);
            }
          },
          outputType,
          quality
        );
      };

      attempt(startDimension, 0.85, 8);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression"));
    };

    img.src = objectUrl;
  });
};