export const prerender = false;

export async function POST({ cookies, redirect }) {
	cookies.delete("userId", {
		path: "/"
	});

	cookies.delete("role", {
		path: "/"
	});

	return redirect("/login", 303);
}