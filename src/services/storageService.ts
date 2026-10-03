/**
 * Storage Service Abstraction
 * ---------------------------
 * Handles image uploading and deletion for WYTU Events.
 *
 * NOTE: For now, this uses a local blob / data URL mock implementation.
 * When Supabase Storage is connected in the future, replace these methods with:
 *   - supabase.storage.from('event-images').upload(...)
 *   - supabase.storage.from('event-images').remove(...)
 */

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const storageService = {
  /**
   * Validates and uploads an event image.
   * Returns a promise resolving to the image URL (or Blob/Data URL in mock mode).
   */
  async uploadEventImage(file: File): Promise<string> {
    // 1. Format validation
    const fileType = file.type.toLowerCase();
    const isAllowedFormat = ALLOWED_TYPES.includes(fileType) || /\.(jpg|jpeg|png|webp)$/i.test(file.name);

    if (!isAllowedFormat) {
      throw new Error(`Unsupported image format (${file.type || 'unknown'}). Please upload a JPG, JPEG, PNG, or WEBP image.`);
    }

    // 2. Size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      throw new Error(`Image size (${sizeMb} MB) exceeds the 5 MB limit. Please select a smaller file.`);
    }

    // 3. Simulate processing latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 4. Development / Mock Upload implementation: Read as Data URL or Object URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to process image file.'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  },

  /**
   * Deletes an event image URL from storage.
   */
  async deleteEventImage(url: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // In Supabase Storage, this would call supabase.storage.from('event-images').remove([path])
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  },
};
