const DB_NAME = "riderzpro_storage";
const STORE_NAME = "images";
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;
const memoryFallback = new Map<string, string>();

function getDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.reject(new Error("IndexedDB not available"));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return dbPromise;
}

export const storageAdapter = {
  /**
   * Saves image data (base64 data URL or Blob) in IndexedDB.
   */
  async saveImage(id: string, data: string | Blob): Promise<string> {
    try {
      let dataUrl: string;
      if (typeof data === "string") {
        dataUrl = data;
      } else {
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(data);
        });
      }

      try {
        const db = await getDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(STORE_NAME, "readwrite");
          const store = tx.objectStore(STORE_NAME);
          const req = store.put({ id, dataUrl, savedAt: Date.now() });
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      } catch {
        // Fallback to memory
        memoryFallback.set(id, dataUrl);
      }

      return id;
    } catch (e) {
      console.error("storageAdapter save error:", e);
      throw e;
    }
  },

  /**
   * Retrieves image data URL by ID from IndexedDB or memory.
   */
  async getImage(id: string): Promise<string | null> {
    if (memoryFallback.has(id)) {
      return memoryFallback.get(id) || null;
    }

    try {
      const db = await getDB();
      return new Promise<string | null>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && req.result.dataUrl) {
            resolve(req.result.dataUrl);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },

  /**
   * Removes an image from storage.
   */
  async deleteImage(id: string): Promise<void> {
    memoryFallback.delete(id);
    try {
      const db = await getDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    } catch {
      // Ignore error
    }
  },

  /**
   * Compresses and resizes an uploaded file to maximum dimension (default 1600px).
   */
  async compressAndStore(
    file: File,
    maxDim = 1600
  ): Promise<{ id: string; dataUrl: string; width: number; height: number; sizeBytes: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;

      img.onload = async () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context failed"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        await storageAdapter.saveImage(id, dataUrl);
        resolve({
          id,
          dataUrl,
          width: img.width,
          height: img.height,
          sizeBytes: Math.round((dataUrl.length * 3) / 4),
        });
      };

      reader.readAsDataURL(file);
    });
  },
};
