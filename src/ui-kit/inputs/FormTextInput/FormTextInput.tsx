import { ControllerProps, FieldPath, FieldValues } from 'react-hook-form';

import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/utils';

interface FormTextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Pick<ControllerProps<TFieldValues, TName>, 'name' | 'defaultValue'> {
  autoFocus?: boolean;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  // multiline?: boolean;
  // minRows?: number;
  // maxRows?: number;
  // inputComponent?: React.ElementType;
  placeholder?: string;
  hideEmptyHelperText?: boolean;
}

export function FormTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  defaultValue,
  autoFocus,
  type = 'text',
  disabled,
  readOnly,
  placeholder,
  hideEmptyHelperText,
}: FormTextInputProps<TFieldValues, TName>) {
  return (
    <FormField
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => {
        const { onChange, onBlur, value, ref } = field;
        const error = fieldState.error?.message;

        return (
          <div className="space-y-2">
            {placeholder && (
              <Label htmlFor={name} className="text-sm font-medium">
                {placeholder}
              </Label>
            )}
            <Input
              id={name}
              type={type}
              ref={ref}
              autoFocus={autoFocus}
              disabled={disabled}
              readOnly={readOnly}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              className={cn(error && 'border-red-500 focus:ring-red-500')}
            />
            {!hideEmptyHelperText && (
              <p className={cn('text-sm', error ? 'text-red-500' : 'text-muted-foreground')}>{error || ' '}</p>
            )}
          </div>
        );
      }}
    />
  );
}
