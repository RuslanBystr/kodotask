import { Control, FieldValues, Path } from 'react-hook-form';

interface IAutocompleteInputProps<TField extends FieldValues> {
  control: Control<TField>;
  name: Path<TField>;
  placeholder?: string;
}

export const DateTimeInput = <TField extends FieldValues>({
  name,
  control,
  placeholder,
  ...props
}: IAutocompleteInputProps<TField>) => (
  // <FormField
  //   name={name}
  //   control={control}
  //   render={({ field, fieldState: { error } }) => {
  //     // const { onChange, value, ref } = field;
  //     return (
  //       <LocalizationProvider dateAdapter={AdapterDateFns}>
  //         <DateTimePicker value={value} onChange={onChange} {...props} ref={ref} />
  //         <FormHelperText>{error ? error.message : ''}</FormHelperText>
  //       </LocalizationProvider>
  //       <div>DateTime</div>
  //     );
  //   }}
  // />
  <div {...props}>DateTime</div>
);
