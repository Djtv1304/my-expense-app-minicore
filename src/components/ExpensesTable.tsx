'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { DepartmentExpense } from '../models/departmentExpense';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpensesTableProps {
  expenses: DepartmentExpense[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10;

export const ExpensesTable = ({ expenses, isLoading }: ExpensesTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DepartmentExpense;
    direction: 'asc' | 'desc';
  }>({
    key: 'departmentName',
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortConfig.key === 'totalAmount') {
      return sortConfig.direction === 'asc'
        ? a.totalAmount - b.totalAmount
        : b.totalAmount - a.totalAmount;
    }
    return sortConfig.direction === 'asc'
      ? a.departmentName.localeCompare(b.departmentName)
      : b.departmentName.localeCompare(a.departmentName);
  });

  const totalPages = Math.ceil(sortedExpenses.length / ITEMS_PER_PAGE);
  const paginatedExpenses = sortedExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSort = (key: keyof DepartmentExpense) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center text-black py-8 text-muted-foreground">
        No se encontraron resultados
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  onClick={() => toggleSort('departmentName')}
                  className="font-medium text-black"
                >
                  Departamento
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  onClick={() => toggleSort('totalAmount')}
                  className="font-medium text-black"
                >
                  Total Gastos
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedExpenses.map((expense) => (
              <TableRow key={expense.departmentId}>
                <TableCell className='text-black'>{expense.departmentName}</TableCell>
                <TableCell className='text-black'>
                  {new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(expense.totalAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="py-2">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};