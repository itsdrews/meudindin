import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react-native";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";

interface DatePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
}

export function DatePicker({ startDate, endDate, onDateChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    startDate ? new Date(startDate.split('/').reverse().join('-')) : undefined
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    endDate ? new Date(endDate.split('/').reverse().join('-')) : undefined
  );
  const [selectingStart, setSelectingStart] = useState(true);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (selectingStart) {
      setSelectedStartDate(date);
      setSelectingStart(false);
    } else {
      setSelectedEndDate(date);
      
      // Apply the dates
      if (selectedStartDate) {
        const start = formatDate(selectedStartDate);
        const end = formatDate(date);
        onDateChange(start, end);
      }
      
      setIsOpen(false);
      setSelectingStart(true);
    }
  };

  const handlePresetSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    setSelectedStartDate(start);
    setSelectedEndDate(end);
    
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    onDateChange(startStr, endStr);
    setIsOpen(false);
    setSelectingStart(true);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm bg-muted px-3 py-1 rounded-md cursor-pointer">
          {startDate}
        </span>
        <span className="text-muted-foreground">—</span>
        <span className="text-sm bg-muted px-3 py-1 rounded-md cursor-pointer">
          {endDate}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="text-sm">
            <p className="mb-2">
              {selectingStart ? 'Selecione a data inicial:' : 'Selecione a data final:'}
            </p>
            <div className="text-xs text-muted-foreground">
              Período: {selectedStartDate ? formatDate(selectedStartDate) : '---'} → {selectedEndDate ? formatDate(selectedEndDate) : '---'}
            </div>
          </div>
          
          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handlePresetSelect(7)}>
              7 dias
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePresetSelect(30)}>
              30 dias
            </Button>
            <Button variant="outline" size="sm" onClick={() => handlePresetSelect(90)}>
              90 dias
            </Button>
          </div>

          <CalendarComponent
            mode="single"
            selected={selectingStart ? selectedStartDate : selectedEndDate}
            onSelect={handleDateSelect}
            initialFocus
          />
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSelectingStart(true);
                setSelectedStartDate(undefined);
                setSelectedEndDate(undefined);
              }}
            >
              Limpar
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}