import bcrypt from "bcrypt";
import { getDb } from "../../lib/mongodb.js";

export const prerender = false;

export async function POST({ request, cookies, redirect }) {
	try {
		const formData = await request.formData();

		const email = formData.get("email")?.toString().trim().toLowerCase();
		const password = formData.get("password")?.toString();

		if (!email || !password) {
			return redirect("/login?error=missing", 303);
		}

		const db = await getDb();
		const users = db.collection("users");

		const user = await users.findOne({ email });

		if (!user) {
			return redirect("/login?error=invalid", 303);
		}

		const passwordMatches = await bcrypt.compare(
			password,
			user.passwordHash
		);

		if (!passwordMatches) {
			return redirect("/login?error=invalid", 303);
		}

		cookies.set("userId", user._id.toString(), {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: import.meta.env.PROD,
			maxAge: 60 * 60 * 24
		});

		cookies.set("role", user.role, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: import.meta.env.PROD,
			maxAge: 60 * 60 * 24
		});

		if (user.role === "credit_manager") {
			return redirect("/dashboard/cm", 303);
		}

		return redirect("/dashboard/lo", 303);

	} catch (error) {
		console.error("Login error:", error);
		return redirect("/login?error=server", 303);
	}
}