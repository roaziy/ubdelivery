import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth
} from 'firebase/auth';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

// Set language to Mongolian
auth.languageCode = 'mn';

// Store confirmation result globally for verification
let confirmationResult: ConfirmationResult | null = null;

// Setup reCAPTCHA verifier
export function setupRecaptcha(buttonId: string): RecaptchaVerifier | null {
  if (typeof window === 'undefined') return null;
  
  // Clear existing verifier if any
  const existingVerifier = (window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier;
  if (existingVerifier) {
    existingVerifier.clear();
  }
  
  const verifier = new RecaptchaVerifier(auth, buttonId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - will proceed with submit function
      console.log('reCAPTCHA verified');
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.log('reCAPTCHA expired');
    }
  });
  
  (window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier = verifier;
  return verifier;
}

// Send OTP to phone number
export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Format phone number for Mongolia (+976)
    const formattedNumber = phoneNumber.startsWith('+976') 
      ? phoneNumber 
      : `+976${phoneNumber}`;
    
    const recaptchaVerifier = (window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier;
    
    if (!recaptchaVerifier) {
      return { success: false, error: 'reCAPTCHA тохируулагдаагүй байна' };
    }
    
    const result = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier);
    confirmationResult = result;
    
    // Store in session for verify page
    sessionStorage.setItem('phoneNumber', phoneNumber);
    
    return { success: true };
  } catch (error: unknown) {
    console.error('Send OTP error:', error);
    const firebaseError = error as { code?: string; message?: string };
    
    // Handle specific Firebase errors
    if (firebaseError.code === 'auth/invalid-phone-number') {
      return { success: false, error: 'Утасны дугаар буруу байна' };
    }
    if (firebaseError.code === 'auth/too-many-requests') {
      return { success: false, error: 'Хэт олон удаа оролдсон байна. Түр хүлээнэ үү' };
    }
    if (firebaseError.code === 'auth/quota-exceeded') {
      return { success: false, error: 'SMS илгээх квот дууссан байна' };
    }
    
    return { 
      success: false, 
      error: firebaseError.message || 'OTP илгээхэд алдаа гарлаа' 
    };
  }
}

// Verify OTP code
export async function verifyOTP(code: string): Promise<{ 
  success: boolean; 
  token?: string; 
  error?: string 
}> {
  try {
    if (!confirmationResult) {
      return { success: false, error: 'OTP илгээгээгүй байна' };
    }
    
    const result = await confirmationResult.confirm(code);
    const idToken = await result.user.getIdToken();
    
    return { success: true, token: idToken };
  } catch (error: unknown) {
    console.error('Verify OTP error:', error);
    const firebaseError = error as { code?: string; message?: string };
    
    if (firebaseError.code === 'auth/invalid-verification-code') {
      return { success: false, error: 'Код буруу байна' };
    }
    if (firebaseError.code === 'auth/code-expired') {
      return { success: false, error: 'Кодын хугацаа дууссан байна' };
    }
    
    return { 
      success: false, 
      error: firebaseError.message || 'Баталгаажуулахад алдаа гарлаа' 
    };
  }
}

// Sign out
export async function signOutFirebase(): Promise<void> {
  try {
    await auth.signOut();
    confirmationResult = null;
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// Get current user's ID token
export async function getCurrentUserToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
}

export { auth };

