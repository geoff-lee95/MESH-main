import { createBrowserClient } from "@/lib/supabase/client";
import QRCode from 'qrcode';

// Create a singleton instance of the Supabase client
const supabase = createBrowserClient();

// Constants for localStorage keys
const TFA_ENABLED_KEY = 'mesh_2fa_enabled_';

// Generate a random secret for 2FA using browser's crypto API
const generateTOTPSecret = (): string => {
  // Generate random bytes
  const getRandomValues = () => {
    const array = new Uint8Array(20);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback to Math.random (less secure)
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return array;
  };

  // Convert random bytes to base32 for TOTP (simplified version)
  const bytes = getRandomValues();
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  
  // Convert bytes to base32 encoding
  for (let i = 0; i < 16; i += 5) {
    const byteSet = bytes.slice(i, i + 5);
    let value = 0;
    for (let j = 0; j < byteSet.length; j++) {
      value = (value << 8) | byteSet[j];
    }
    
    for (let j = 0; j < 8 && i + j < 16; j++) {
      secret += base32Chars[(value >> (5 * (7 - j))) & 31];
    }
  }
  
  return secret;
};

// Generate QR code for 2FA setup
export const generateQRCode = async (email: string): Promise<string> => {
  // Generate a TOTP secret for the user
  const secret = generateTOTPSecret();
  const issuer = 'MESH';
  const uri = `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`;
  
  try {
    // Generate QR code as data URL
    const dataUrl = await QRCode.toDataURL(uri);
    
    // Store the secret in localStorage for demo purposes
    if (typeof window !== 'undefined') {
      localStorage.setItem(`mesh_2fa_secret_${email}`, secret);
    }
    
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Enable 2FA for a user
export const enable2FA = async (userId: string): Promise<{ error: any | null; success: boolean }> => {
  try {
    // Store in localStorage for demo
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${TFA_ENABLED_KEY}${userId}`, 'true');
    }

    return { error: null, success: true };
  } catch (error: any) {
    console.error("Unexpected error enabling 2FA:", error);
    return { error: error.message, success: false };
  }
};

// Disable 2FA for a user
export const disable2FA = async (userId: string): Promise<{ error: any | null; success: boolean }> => {
  try {
    // Remove from localStorage for demo
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`${TFA_ENABLED_KEY}${userId}`);
    }

    return { error: null, success: true };
  } catch (error: any) {
    console.error("Unexpected error disabling 2FA:", error);
    return { error: error.message, success: false };
  }
};

// Verify a 2FA code (TOTP)
export const verify2FACode = async (userId: string, code: string): Promise<{ error: any | null; success: boolean }> => {
  try {
    // In a real app, you would retrieve the user's TOTP secret and verify the code
    // For demo purposes, we'll accept any 6-digit code
    if (code && code.length === 6 && /^\d{6}$/.test(code)) {
      return { error: null, success: true };
    }
    
    return { error: 'Invalid verification code. Please enter a 6-digit code.', success: false };
  } catch (error: any) {
    console.error("Unexpected error verifying 2FA code:", error);
    return { error: error.message, success: false };
  }
};

// Check if 2FA is enabled for a user
export const is2FAEnabled = async (userId: string): Promise<boolean> => {
  try {
    // Check localStorage for demo
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`${TFA_ENABLED_KEY}${userId}`) === 'true';
    }
    return false;
  } catch (error) {
    console.error("Unexpected error checking 2FA status:", error);
    return false;
  }
}; 