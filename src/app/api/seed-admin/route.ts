import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function GET() {
  try {
    const email = "admin@igo.com";
    const password = "admin123";
    
    // Create the admin user using the client SDK (works in server-side Next.js route as well)
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Save role in Firestore
    await setDoc(doc(db, "users", credential.user.uid), {
      uid: credential.user.uid,
      email: email,
      role: "admin",
      displayName: "System Admin",
      createdAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, message: "Admin account seeded successfully. You can now login with admin@igo.com / admin123" });
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    if (firebaseError.code === 'auth/email-already-in-use') {
      return NextResponse.json({ success: true, message: "Admin account already exists." });
    }
    console.error("Error seeding admin:", error);
    return NextResponse.json({ success: false, error: firebaseError.message }, { status: 500 });
  }
}
