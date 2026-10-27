const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_MB = 10;
const MAX_DIMENSION = 8000;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate an uploaded image file.
 */
export function validateImageFile(file: File, maxSizeMB: number = MAX_FILE_SIZE_MB): ValidationResult {
  const maxBytes = maxSizeMB * 1024 * 1024;

  // Check file type
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format "${file.type || 'unknown'}". Please upload a JPG, PNG, or WEBP image.`,
    };
  }

  // Check file size
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds the ${maxSizeMB} MB limit.`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'The file appears to be empty.',
    };
  }

  return { valid: true };
}

/**
 * Validate image dimensions after loading.
 */
export function validateImageDimensions(width: number, height: number): ValidationResult {
  if (width === 0 || height === 0) {
    return {
      valid: false,
      error: 'The image has invalid dimensions (zero width or height).',
    };
  }

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return {
      valid: false,
      error: `Image dimensions (${width}×${height}) exceed the maximum allowed (${MAX_DIMENSION}×${MAX_DIMENSION}).`,
    };
  }

  return { valid: true };
}

/**
 * Load an image from a File object and return its dimensions.
 */
export function loadImage(file: File): Promise<{ img: HTMLImageElement; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({ img, width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load the image. The file may be corrupted or unreadable.'));
    };

    img.src = url;
  });
}
