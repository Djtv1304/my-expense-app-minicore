import { Expense } from "@/models/expense";
import { Department } from "@/models/department";

export const fetchExpenses = async (startDate: string, endDate: string) => {
  const response = await fetch(
    `/api/expenses?startDate=${startDate}&endDate=${endDate}`
  );
  if (!response.ok) throw new Error("Failed to fetch expenses");
  return response.json();
};

export const calculateDepartmentExpenses = (
  expenses: Expense[],
  departments: Department[]
) => {
  const departmentMap = new Map(
    departments.map((dept) => [dept.id, dept.name])
  );
  const expensesByDepartment = new Map<string, number>();

  expenses.forEach((expense) => {
    const currentTotal = expensesByDepartment.get(expense.departmentId) || 0;
    expensesByDepartment.set(
      expense.departmentId,
      currentTotal + expense.amount
    );
  });

  return Array.from(expensesByDepartment.entries()).map(
    ([departmentId, totalAmount]) => ({
      departmentId,
      departmentName: departmentMap.get(departmentId) || "Unknown Department",
      totalAmount,
    })
  );
};
