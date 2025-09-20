import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { defaultInitialValue } from '@/components/forms/project/constants';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUploadFileMutation } from '@/services/file';
import type { IFormProps } from '@/types';
import { getEnv } from '@/utils';

export interface IProjectFormParams {
  id?: string;
  name: string;
  description: string;
  image?: string;
}

const { api } = getEnv();

const ProjectForm: React.FC<IFormProps<IProjectFormParams>> = ({
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

  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [uploadFile] = useUploadFileMutation();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files ? e.target.files[0] : null;
    setProjectImage(selectedImage);
  };

  useEffect(() => {
    if (projectImage) {
      (async () => {
        try {
          const { uuid } = await uploadFile(projectImage).unwrap();
          setValue('image', uuid, { shouldDirty: true });
        } catch (err) {
          console.error('Upload failed:', err); // eslint-disable-line no-console
        }
      })();
    }
  }, [projectImage, uploadFile, setValue]);

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="">
          {initialValues.image && (
            <div className="h-full w-auto flex">
              <img className="w-full" src={`${api}/file/${initialValues.image}`} alt="Project" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 bg-blue-100">
            <div className="row-span-2">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="h-full">
                    <FormLabel>Image</FormLabel>

                    <div className="h-full rounded-none flex items-center justify-center">
                      <Input type="file" onChange={handleImageChange} />
                    </div>

                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="rounded-none bg-[--main-button] hover:bg-[--main-button-hover] cut cut-left-5 cut-right-5"
            variant="outline"
            disabled={isLoading || !isDirty}
          >
            <SaveIcon />
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProjectForm;
