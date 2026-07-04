import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// One-time admin bootstrap endpoint.
//
// SECURITY: this used to be a public GET route that created an admin account
// with a hardcoded email/password (admin@igo.com / admin123) that anyone could
// trigger just by visiting the URL. It is now a POST-only route protected by a
// secret token, with no credentials hardcoded in source.
//
// To use it once:
//   1. Set these in your environment (not committed to git): ADMIN_SEED_SECRET,
//      ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD
//   2. Call it once: curl -X POST https://yoursite.com/api/seed-admin \
//        -H "x-seed-secret: <ADMIN_SEED_SECRET value>"
//   3. Remove/rotate ADMIN_SEED_SECRET afterwards so the route can't be re-run.
export async function POST(request: Request) {
  const providedSecret = request.headers.get("x-seed-secret");
  const expectedSecret = process.env.ADMIN_SEED_SECRET;

  if (!expectedSecret || !providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ success: false, error: "Not authorized." }, { status: 403 });
  }

  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD are not configured." },
      { status: 500 }
    );
  }

  try {
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

    return NextResponse.json({ success: true, message: "Admin account seeded successfully." });
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    if (firebaseError.code === 'auth/email-already-in-use') {
      return NextResponse.json({ success: true, message: "Admin account already exists." });
    }
    console.error("Error seeding admin:", error);
    return NextResponse.json({ success: false, error: firebaseError.message }, { status: 500 });
  }
}
