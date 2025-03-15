import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { FieldsRow } from '@/components/forms/fields-row';
import { defaultInitialValue } from '@/components/forms/UserForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useUploadFileMutation } from '@/services/file';
import type { IFormProps } from '@/types';
import { getEnv } from '@/utils';

interface IUserFormParams {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword?: string;
  isBlocked: boolean;
  phone?: string;
  avatar?: string;
}

const { api } = getEnv();

const UserForm: React.FC<IFormProps<IUserFormParams>> = ({
  validationSchema,
  isLoading,
  onSubmit,
  initialValues = defaultInitialValue,
}) => {
  const form = useForm({
    defaultValues: initialValues,
    reValidateMode: 'onSubmit',
    resolver: zodResolver(validationSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
    setValue,
  } = form;

  const [productImage, setProductImage] = useState<File | null>(null);
  const [uploadFile] = useUploadFileMutation();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files ? e.target.files[0] : null;
    setProductImage(selectedImage);
  };

  useEffect(() => {
    if (productImage) {
      (async () => {
        try {
          const { uuid } = await uploadFile(productImage).unwrap();
          setValue('avatar', uuid, { shouldDirty: true });
        } catch (err) {
          console.error('Upload failed:', err); // eslint-disable-line no-console
        }
      })();
    }
  }, [productImage, uploadFile, setValue]);

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <div className=" p-5 max-w-[540px] w-[100%]">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-4">
          {initialValues.avatar && (
            <div className="h-[200px] w-[200px] flex mx-auto">
              <img className="w-full" src={`${api}/file/${initialValues.avatar}`} alt="Product" />
            </div>
          )}
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <Input type="file" onChange={handleImageChange} />
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FieldsRow>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldsRow>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@mail.com"
                    autoFocus={false}
                    autoComplete="off"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readOnly')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FieldsRow>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldsRow>
          <FieldsRow>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isBlocked"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blocked</FormLabel>
                  <FormControl>
                    <Checkbox
                      className="h-[30px] w-[30px]"
                      aria-label="meforef"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldsRow>

          <Button type="submit" disabled={isLoading || !isDirty}>
            <SaveIcon />
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
