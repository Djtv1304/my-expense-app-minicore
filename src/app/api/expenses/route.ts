import { NextRequest, NextResponse } from "next/server";
import { getDepartmentExpensesByDateRange } from "../../../controllers/expensesController";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json({ message: "Start and end dates are required." }, { status: 400 });
  }

  try {
    const departmentExpenses = await getDepartmentExpensesByDateRange(startDate, endDate);
    console.log('Department expenses', departmentExpenses);
    console.log('Department expenses xd', NextResponse.json(departmentExpenses));
    return NextResponse.json(departmentExpenses);
  } catch (error) {
    return NextResponse.json({ message: "Internal server error.", error }, { status: 500 });
  }
}