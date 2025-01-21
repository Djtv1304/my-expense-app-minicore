import { Expense } from "@/models/expense";
import { Department } from "@/models/department";

export const fetchExpenses = async (startDate: string, endDate: string) => {
  const response = await fetch(
    `http://localhost:3000/api/expenses?startDate=${startDate}&endDate=${endDate}`
  );
  if (!response.ok) throw new Error("Failed to fetch expenses");
  return response.json();
};
