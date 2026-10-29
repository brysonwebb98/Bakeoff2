import bcrypt from "bcrypt";
import { getDb } from "../../lib/mongodb.js";

export const prerender = false;

export async function POST({ request, redirect }) {
	try {
        console.log("SIGNUP POST RECEIVED");
		const formData = await request.formData();

		const email = formData.get("email")?.toString().trim().toLowerCase();
		const password = formData.get("password")?.toString();

		// Basic validation
		if (!email || !password) {
			return new Response("Email and password are required.", {
				status: 400
			});
		}

		if (password.length < 6) {
			return new Response("Password must be at least 6 characters.", {
				status: 400
			});
		}

		// Connect to MongoDB
		const db = await getDb();
		const users = db.collection("users");

		// Check for existing account
		const existingUser = await users.findOne({ email });

		if (existingUser) {
            return redirect("/signup?error=exists", 303);
        }

		// Hash password
		const passwordHash = await bcrypt.hash(password, 10);

		// Create user
		await users.insertOne({
			email,
			passwordHash,
			role: "loan_officer",
			createdAt: new Date()
		});

		// Send user to login after successful signup
		return redirect("/login", 303);

	} catch (error) {
		console.error("Signup error:", error);

        console.log("Email:", formData.get("email"));
	    console.log("Password:", formData.get("password"));

		return new Response("Something went wrong creating the account.", {
			status: 500
		});
	}
}