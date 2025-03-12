import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/utils';

interface IAutocompleteInputOptions {
  label: string;
  value: string;
}

interface IAutocompleteInputProps<TOptions extends IAutocompleteInputOptions, TField extends FieldValues> {
  control: Control<TField>;
  name: Path<TField>;
  options: TOptions[];
  placeholder?: string;
}

export const AutocompleteInput = <TOptions extends IAutocompleteInputOptions, TField extends FieldValues>({
  name,
  options,
  control,
  placeholder,
}: IAutocompleteInputProps<TOptions, TField>) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value } = field;

        const selectedOption = options.find((option) => option.value === value);

        return (
          <div className="space-y-2">
            {placeholder && (
              <Label htmlFor={name} className="text-sm font-medium">
                {placeholder}
              </Label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn('w-full justify-between', error && 'border-red-500 focus:ring-red-500')}
                >
                  {selectedOption?.label || 'Select an option'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <div className="flex flex-col space-y-1 p-2">
                  {options.map((option) => (
                    <Button
                      key={option.value}
                      variant="ghost"
                      className="w-full text-left"
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </div>
        );
      }}
    />
  );
};
