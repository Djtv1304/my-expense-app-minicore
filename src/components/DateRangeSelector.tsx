'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDateRange } from '../app/hooks/useDateRange';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateRangeSelectorProps {
  onSearch: (startDate: Date, endDate: Date) => Promise<void>;
  className?: string;
}

export const DateRangeSelector = ({ onSearch, className }: DateRangeSelectorProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { dateRange, error, updateDateRange } = useDateRange();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      await onSearch(dateRange.startDate, dateRange.endDate);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (value: string, isStartDate: boolean) => {
    if (!value) return;
    
    if (isStartDate) {
      updateDateRange(value, undefined);
    } else {
      updateDateRange(undefined, value);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Desde
          </Label>
          <Input
            type="date"
            id="startDate"
            aria-label="Fecha de inicio"
            value={format(dateRange.startDate, 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange(e.target.value, true)}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            Hasta
          </Label>
          <Input
            type="date"
            id="endDate"
            aria-label="Fecha final"
            value={format(dateRange.endDate, 'yyyy-MM-dd')}
            onChange={(e) => handleDateChange(e.target.value, false)}
            max={format(new Date(), 'yyyy-MM-dd')}
            className="w-full"
          />
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button
        onClick={handleSearch}
        disabled={isLoading || !!error}
        className="w-full md:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Buscando...
          </>
        ) : (
          'Buscar'
        )}
      </Button>
    </div>
  );
};