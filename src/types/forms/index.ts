export * from './edit-user';

export interface IFormProps<T> {
  id?: string;
  initialValues?: T;
  onSubmit: (params: T) => void;
  isLoading: boolean;
  isSuccess?: boolean;
  validationSchema: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
