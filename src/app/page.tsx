'use client';

import { useState } from 'react';
import { DateRangeSelector } from '../components/DateRangeSelector';
import { ExpensesTable } from '../components/ExpensesTable';
import { DepartmentExpense } from '../models/departmentExpense';
import { fetchExpenses } from '../services/expenses';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function Dashboard() {
  const [expenses, setExpenses] = useState<DepartmentExpense[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (startDate: Date, endDate: Date) => {
    setIsLoading(true);
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      const expensesData = await fetchExpenses(formattedStartDate, formattedEndDate);
      //const departmentExpenses = calculateDepartmentExpenses(expensesData.expenses, expensesData.departments);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-black font-bold mb-8">Sistema de Gestión de Gastos</h1>
        
        <div className="grid gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-black">Filtros</h2>
            <DateRangeSelector onSearch={handleSearch} />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="p-6 bg-card rounded-lg shadow-sm bg-white">
              <h2 className="text-2xl text-black font-semibold mb-4">Gastos por Departamento</h2>
              <ExpensesTable expenses={expenses} isLoading={isLoading} />
            </div>

            <div className="p-6 bg-card rounded-lg shadow-sm bg-white">
              <h2 className="text-2xl text-black font-semibold mb-4">Gráfico de Gastos</h2>
              {expenses.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={expenses}>
                    <XAxis
                      dataKey="departmentName"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#FFF' , color: '#000'}} />
                    <Bar
                      dataKey="totalAmount"
                      fill="hsl(var(--primary))"
                      name="Total Gastos"
                    />
                    </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  {isLoading ? 'Cargando...' : 'Seleccione un rango de fechas para ver el gráfico'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}