'use client';

import { useState, useCallback } from 'react';
import { DateRange } from '../../models/dateRange';
import { startOfDay, addMonths, isAfter, parseISO } from 'date-fns';

interface UseDateRangeProps {
  maxMonthsRange?: number;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const useDateRange = ({ maxMonthsRange = 12 }: UseDateRangeProps = {}) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: startOfDay(new Date()),
    endDate: startOfDay(new Date())
  });
  const [error, setError] = useState<string | null>(null);

  const validateDateRange = useCallback(
    (start: Date, end: Date): ValidationResult => {
      const today = startOfDay(new Date());
      const startOfDayDate = startOfDay(start);
      const endOfDayDate = startOfDay(end);
      
      // Comparamos usando startOfDay para ignorar las horas
      if (isAfter(startOfDayDate, today) || isAfter(endOfDayDate, today)) {
        return {
          isValid: false,
          error: 'Las fechas futuras no están permitidas'
        };
      }

      if (isAfter(startOfDayDate, endOfDayDate)) {
        return {
          isValid: false,
          error: 'La fecha de inicio debe ser anterior a la fecha final'
        };
      }

      const maxRange = addMonths(startOfDayDate, maxMonthsRange);
      if (isAfter(endOfDayDate, maxRange)) {
        return {
          isValid: false,
          error: `El rango máximo permitido es de ${maxMonthsRange} meses`
        };
      }

      return { isValid: true };
    },
    [maxMonthsRange]
  );

  const updateDateRange = useCallback(
    (newStartDate?: Date | string, newEndDate?: Date | string) => {
      const start = newStartDate 
        ? (typeof newStartDate === 'string' ? parseISO(newStartDate) : newStartDate)
        : dateRange.startDate;
      const end = newEndDate
        ? (typeof newEndDate === 'string' ? parseISO(newEndDate) : newEndDate)
        : dateRange.endDate;

      const startOfDayStart = startOfDay(start);
      const startOfDayEnd = startOfDay(end);

      const validation = validateDateRange(startOfDayStart, startOfDayEnd);
      
      if (!validation.isValid) {
        setError(validation.error ?? null);
        return false;
      }

      setError(null);
      setDateRange({ 
        startDate: startOfDayStart, 
        endDate: startOfDayEnd 
      });
      return true;
    },
    [dateRange, validateDateRange]
  );

  return {
    dateRange,
    error,
    updateDateRange
  };
};