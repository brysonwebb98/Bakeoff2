import { ObjectId } from "mongodb";
import { getDb } from "../../lib/mongodb.js";

export const prerender = false;

export async function POST({ request, cookies, redirect }) {
	try {
		const userId = cookies.get("userId")?.value;

		if (!userId) {
			return redirect("/login?error=login-required", 303);
		}

		const formData = await request.formData();

		const firstName = formData.get("firstName")?.toString().trim();
		const lastName = formData.get("lastName")?.toString().trim();
		const purpose = formData.get("purpose")?.toString();

		const loanRequest = Number(formData.get("loanRequest"));
		const monthlyIncome = Number(formData.get("monthlyIncome"));
		const monthlyDebt = Number(formData.get("monthlyDebt"));
		const creditScore = Number(formData.get("creditScore"));

		const validPurposes = [
			"purchase",
			"debt_consolidation",
			"refinance"
		];

		if (
			!firstName ||
			!lastName ||
			!validPurposes.includes(purpose) ||
			loanRequest <= 0 ||
			monthlyIncome <= 0 ||
			monthlyDebt < 0 ||
			creditScore < 300 ||
			creditScore > 850
		) {
			return redirect("/applications/create?error=invalid", 303);
		}

		const dti = (monthlyDebt / monthlyIncome) * 100;

		const db = await getDb();
		const applications = db.collection("applications");

		const result = await applications.insertOne({
            userId: new ObjectId(userId),
            firstName,
            lastName,
            loanRequest,
            purpose,
            monthlyIncome,
            monthlyDebt,
            creditScore,
            dti,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return redirect(`/underwriting/${result.insertedId.toString()}`, 303);

	} catch (error) {
		console.error("Application creation error:", error);

		return redirect("/applications/create?error=server", 303);
	}
}