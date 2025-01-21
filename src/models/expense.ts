export interface Expense {
    id: string;
    date: string; // Formato ISO-8601
    description: string;
    amount: number;
    employeeId: string;
    departmentId: string;
}
