import { ChangeEvent, forwardRef, ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/utils';

export type TextInputProps = {
  type?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  helperText?: ReactNode;
  label?: string;
  className?: string;
};

export const TextInput = forwardRef<
  HTMLInputElement | null,
  TextInputProps & {
    name: string;
    value?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  }
>((props, ref) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleClickShowPassword = () => setIsShowPassword((show) => !show);

  return (
    <div className={cn('space-y-2', props.className)}>
      {props.label && (
        <Label htmlFor={props.name} className="text-sm font-medium">
          {props.label}
        </Label>
      )}
      <div className="relative">
        <Input
          id={props.name}
          ref={ref}
          name={props.name}
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          type={props.type === 'password' && isShowPassword ? 'text' : props.type}
          disabled={props.disabled}
          autoComplete={props.autoComplete}
          readOnly={props.readOnly}
          className={cn('pr-12', props.error && 'border-red-500 focus:ring-red-500')}
        />
        {props.type === 'password' && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 flex items-center justify-center"
            onClick={handleClickShowPassword}
          >
            {isShowPassword ? 'Hide' : 'Show'}
          </Button>
        )}
      </div>
      {props.helperText && (
        <p className={cn('text-sm', props.error ? 'text-red-500' : 'text-muted')}>{props.helperText}</p>
      )}
    </div>
  );
});

TextInput.displayName = 'TextInput';
