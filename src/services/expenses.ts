export const fetchExpenses = async (startDate: string, endDate: string) => {
  const response = await fetch(
    `/api/expenses?startDate=${startDate}&endDate=${endDate}`
  );
  if (!response.ok) throw new Error("Failed to fetch expenses");
  return response.json();
};
