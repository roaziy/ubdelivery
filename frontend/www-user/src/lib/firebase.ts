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

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missing = required.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);
  
  if (missing.length > 0) {
    console.error('❌ Firebase configuration is missing:', missing);
    console.error('Please create a .env.local file in frontend/www-user/ with:');
    console.error(`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
    `);
    return false;
  }
  
  // Debug: Log config (without sensitive data)
  if (typeof window !== 'undefined') {
    console.log('✅ Firebase Config Loaded:', {
      apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING',
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      hasStorageBucket: !!firebaseConfig.storageBucket,
      hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
      hasAppId: !!firebaseConfig.appId
    });
  }
  
  return true;
};

// Initialize Firebase
let app;
let auth: Auth;

try {
  if (validateFirebaseConfig()) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } else {
    // Create a dummy app to prevent crashes, but it won't work
    app = initializeApp({
      apiKey: 'dummy',
      authDomain: 'dummy',
      projectId: 'dummy',
      storageBucket: 'dummy',
      messagingSenderId: 'dummy',
      appId: 'dummy'
    }, 'dummy');
    auth = getAuth(app);
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create dummy app as fallback
  app = initializeApp({
    apiKey: 'dummy',
    authDomain: 'dummy',
    projectId: 'dummy',
    storageBucket: 'dummy',
    messagingSenderId: 'dummy',
    appId: 'dummy'
  }, 'dummy-fallback');
  auth = getAuth(app);
}

// Set language to Mongolian
auth.languageCode = 'mn';

// Store confirmation result globally for verification
let confirmationResult: ConfirmationResult | null = null;

// Setup reCAPTCHA verifier - truly invisible
export function setupRecaptcha(containerId: string): RecaptchaVerifier | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Clear existing verifier if any
    const existingVerifier = (window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier;
    if (existingVerifier) {
      try {
        existingVerifier.clear();
      } catch (e) {
        // Ignore clear errors
      }
    }
    
    // Create hidden container if it doesn't exist
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.display = 'none';
      container.style.visibility = 'hidden';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      document.body.appendChild(container);
    }
    
    // Use invisible reCAPTCHA - this prevents popups
    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved silently
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        // Silently handle expiration
        console.log('reCAPTCHA expired');
      }
    });
    
    if (verifier) {
      (window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier = verifier;
      return verifier;
    }
    return null;
  } catch (error) {
    console.error('reCAPTCHA setup error:', error);
    return null;
  }
}

// Send OTP to phone number
export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if Firebase is properly configured
    if (!validateFirebaseConfig()) {
      return { 
        success: false, 
        error: 'Firebase тохиргоо дутуу байна. .env.local файлыг шалгана уу.' 
      };
    }

    // Format phone number for Mongolia (+976)
    const formattedNumber = phoneNumber.startsWith('+976') 
      ? phoneNumber 
      : `+976${phoneNumber}`;
    
    // Get or create reCAPTCHA verifier
    let recaptchaVerifier = (window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier;
    
    // If verifier doesn't exist, try to create it
    if (!recaptchaVerifier) {
      const containerId = 'recaptcha-container';
      // Make sure container exists
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);
      }
      const newVerifier = setupRecaptcha(containerId);
      recaptchaVerifier = newVerifier || undefined;
    }
    
    if (!recaptchaVerifier) {
      return { success: false, error: 'reCAPTCHA тохируулагдаагүй байна. Дахин оролдоно уу.' };
    }
    
    console.log('📱 Attempting to send OTP to:', formattedNumber);
    console.log('🔐 Using Firebase project:', firebaseConfig.projectId);
    
    const result = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier);
    confirmationResult = result;
    
    // Store in session for verify page
    sessionStorage.setItem('phoneNumber', phoneNumber);
    
    console.log('✅ OTP sent successfully');
    return { success: true };
  } catch (error: unknown) {
    console.error('Send OTP error:', error);
    const firebaseError = error as { code?: string; message?: string };
    
    // Handle specific Firebase errors
    if (firebaseError.code === 'auth/invalid-app-credential') {
      console.error('❌ Invalid app credential. Common causes:');
      console.error('1. API key restrictions in Google Cloud Console');
      console.error('2. Identity Toolkit API not enabled');
      console.error('3. Need to wait a few minutes after enabling Phone Auth');
      console.error('4. Check Google Cloud Console > APIs & Services > Credentials');
      return { 
        success: false, 
        error: 'API түлхүүрийн хязгаарлалт байж магадгүй. Google Cloud Console дээр API түлхүүрийн хязгаарлалтыг шалгана уу.' 
      };
    }
    if (firebaseError.code === 'auth/invalid-api-key') {
      return { 
        success: false, 
        error: 'Firebase API түлхүүр буруу байна. .env.local файлын NEXT_PUBLIC_FIREBASE_API_KEY-г шалгана уу.' 
      };
    }
    if (firebaseError.code === 'auth/invalid-phone-number') {
      return { success: false, error: 'Утасны дугаар буруу байна' };
    }
    if (firebaseError.code === 'auth/too-many-requests') {
      return { success: false, error: 'Хэт олон удаа оролдсон байна. Түр хүлээнэ үү' };
    }
    if (firebaseError.code === 'auth/quota-exceeded') {
      return { success: false, error: 'SMS илгээх квот дууссан байна' };
    }
    if (firebaseError.code === 'auth/operation-not-allowed') {
      return { 
        success: false, 
        error: 'Утасны дугаараар нэвтрэх идэвхжээгүй байна. Firebase Console > Authentication > Sign-in method > Phone-г идэвхжүүлнэ үү.' 
      };
    }
    if (firebaseError.code === 'auth/captcha-check-failed') {
      return { 
        success: false, 
        error: 'reCAPTCHA шалгалт амжилтгүй. Дахин оролдоно уу.' 
      };
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

