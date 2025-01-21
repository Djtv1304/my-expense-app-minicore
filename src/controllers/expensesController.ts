import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { DepartmentExpense } from "../models/departmentExpense";

export const getDepartmentExpensesByDateRange = async (startDate: string, endDate: string): Promise<DepartmentExpense[]> => {
  const expensesRef = collection(db, "expenses");
  const q = query(expensesRef, where("date", ">=", startDate), where("date", "<=", endDate));
  const querySnapshot = await getDocs(q);

  const departmentTotals: Record<string, number> = {};

  querySnapshot.forEach((doc) => {
    const expense = doc.data();
    if (expense.departmentId && expense.amount) {
      if (!departmentTotals[expense.departmentId]) {
        departmentTotals[expense.departmentId] = 0;
      }
      departmentTotals[expense.departmentId] += expense.amount;
    }
  });

  const departmentsRef = collection(db, "departments");
  const departmentsSnapshot = await getDocs(departmentsRef);
  const departmentNames: Record<string, string> = {};

  departmentsSnapshot.forEach((doc) => {
    const department = doc.data();
    if (department.id && department.name) {
      departmentNames[department.id] = department.name;
    }
  });

  return Object.entries(departmentTotals).map(([departmentId, totalAmount]) => ({
    departmentId,
    totalAmount,
    departmentName: departmentNames[departmentId] || "Unknown",
  }));
};