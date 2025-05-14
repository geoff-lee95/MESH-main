import { createBrowserClient } from "@/lib/supabase/client";

// Create a singleton instance of the Supabase client
const supabase = createBrowserClient();

// Constants for localStorage keys
const API_KEYS_KEY = 'mesh_api_keys_';

// Generate a UUID using browser's crypto API
const generateUUID = (): string => {
  // Use crypto.randomUUID() if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  const getRandomValues = (buffer: Uint8Array) => {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      return crypto.getRandomValues(buffer);
    }
    // Fallback to Math.random
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  };

  const buffer = new Uint8Array(16);
  getRandomValues(buffer);
  
  // Set version (4) and variant bits
  buffer[6] = (buffer[6] & 0x0f) | 0x40;
  buffer[8] = (buffer[8] & 0x3f) | 0x80;
  
  // Format as UUID string
  let uuid = '';
  for (let i = 0; i < 16; i++) {
    if (i === 4 || i === 6 || i === 8 || i === 10) {
      uuid += '-';
    }
    uuid += (buffer[i] < 16 ? '0' : '') + buffer[i].toString(16);
  }
  
  return uuid;
};

// Helper to get stored API keys from localStorage
const getStoredApiKeys = (userId: string): any[] => {
  if (typeof window === 'undefined') return [];
  
  const keysJson = localStorage.getItem(`${API_KEYS_KEY}${userId}`);
  if (!keysJson) return [];
  
  try {
    return JSON.parse(keysJson);
  } catch (e) {
    console.error('Error parsing stored API keys:', e);
    return [];
  }
};

// Helper to save API keys to localStorage
const saveApiKeys = (userId: string, keys: any[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${API_KEYS_KEY}${userId}`, JSON.stringify(keys));
};

// Generate a new API key
export const generateApiKey = async (userId: string): Promise<{ key: string | null; error: any | null }> => {
  try {
    // Generate a unique API key
    const uuid = generateUUID();
    const key = `mesh_${uuid.replace(/-/g, '')}_${Date.now().toString(36)}`;
    
    // Get existing keys
    const existingKeys = getStoredApiKeys(userId);
    
    // Add new key
    const newKey = {
      id: generateUUID(),
      user_id: userId,
      key_hash: key, // In a real app, store a hash, not the actual key
      created_at: new Date().toISOString(),
      last_used: null,
      is_active: true
    };
    
    existingKeys.push(newKey);
    
    // Save to localStorage
    saveApiKeys(userId, existingKeys);

    return { key, error: null };
  } catch (error: any) {
    console.error("Unexpected error generating API key:", error);
    return { key: null, error: error.message };
  }
};

// Get a user's API keys
export const getUserApiKeys = async (userId: string): Promise<{ keys: any[] | null; error: any | null }> => {
  try {
    const keys = getStoredApiKeys(userId).filter(k => k.is_active);
    return { keys, error: null };
  } catch (error: any) {
    console.error("Unexpected error fetching API keys:", error);
    return { keys: null, error: error.message };
  }
};

// Revoke (deactivate) an API key
export const revokeApiKey = async (keyId: string): Promise<{ success: boolean; error: any | null }> => {
  try {
    // Find the key in localStorage
    const allKeys: Record<string, any[]> = {};
    
    // This is inefficient but works for a demo
    if (typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(API_KEYS_KEY)) {
          const userId = key.replace(API_KEYS_KEY, '');
          const userKeys = getStoredApiKeys(userId);
          
          // Check if this user has the key
          const keyIndex = userKeys.findIndex(k => k.id === keyId);
          if (keyIndex >= 0) {
            // Update the key
            userKeys[keyIndex].is_active = false;
            saveApiKeys(userId, userKeys);
            return { success: true, error: null };
          }
          
          allKeys[userId] = userKeys;
        }
      }
    }
    
    return { success: false, error: "API key not found" };
  } catch (error: any) {
    console.error("Unexpected error revoking API key:", error);
    return { success: false, error: error.message };
  }
}; 