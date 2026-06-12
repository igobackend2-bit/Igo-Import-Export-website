// src/lib/authService.ts
// Firebase Authentication service — wraps all auth operations

import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export type UserRole = "admin" | "seller" | "buyer";

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  companyName?: string;
  createdAt: string;
}

/**
 * Register a new user with email and password.
 */
export async function registerUser(
  email: string,
  password: string,
  role: UserRole,
  profileData: Omit<UserProfile, "uid" | "email" | "role" | "createdAt">
): Promise<{ user: User; role: UserRole }> {
  const { createUserWithEmailAndPassword, sendEmailVerification } = await import("firebase/auth");
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Set the user profile with the requested role
  await upsertUserProfile(credential.user.uid, {
    uid: credential.user.uid,
    email,
    role,
    ...profileData,
    createdAt: new Date().toISOString()
  });

  // Send verification email
  try {
    // Check if running on localhost to log the URL, but Firebase SDK doesn't natively expose the link in client SDK unless we use Admin SDK. 
    // We'll just call sendEmailVerification and log a message.
    await sendEmailVerification(credential.user);
    console.log(`[LOCAL DEV FALLBACK] Verification email sent to ${email}. If SMTP is not configured, please check the Firebase console to verify the user manually.`);
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }

  return { user: credential.user, role };
}

/**
 * Sign in with email and password.
 * Returns { user, role } on success, throws on failure.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User; role: UserRole }> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const role = await getUserRole(credential.user.uid);
  return { user: credential.user, role };
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Send a password reset email.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Fetch the role of a user from Firestore `users` collection.
 * Falls back to "buyer" if no role document exists.
 */
export async function getUserRole(uid: string): Promise<UserRole> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return (userDoc.data()?.role as UserRole) || "buyer";
    }
    return "buyer";
  } catch (err) {
    console.log("getUserRole catch block error:", err);
    return "buyer";
  }
}

/**
 * Create or update the user profile in Firestore.
 */
export async function upsertUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  await setDoc(doc(db, "users", uid), data, { merge: true });
}

/**
 * Subscribe to auth state changes.
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}
