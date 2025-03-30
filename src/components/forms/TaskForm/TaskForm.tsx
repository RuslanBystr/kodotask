import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { defaultInitialValue } from '@/components/forms/TaskForm';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskStatusEnum } from '@/constants/enums/task-status.enum';
import { useGetProjectsQuery } from '@/services/project';
import { useGetUsersQuery } from '@/services/users';
import type { IFormProps } from '@/types';
import { IProjectResponse } from '@/types/responses/IProjectResponse';
import { IUserResponse } from '@/types/responses/IUserResponse';

export interface ITaskFormParams {
  id?: string;
  title: string;
  description: string;
  assignedUserId: string;
  projectId: string;
  author?: string;
  estimate?: number;
  priority: string;
  status?: TaskStatusEnum;
}

const TaskForm: React.FC<IFormProps<ITaskFormParams>> = ({
  validationSchema,
  isLoading,
  onSubmit,
  initialValues = defaultInitialValue,
}) => {
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery({ limit: 20, page: 1 });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjectsQuery({ limit: 20, page: 1 });

  const form = useForm({
    defaultValues: initialValues,
    reValidateMode: 'onSubmit',
    resolver: zodResolver(validationSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  if (isLoadingUsers && isLoadingProjects) return <p>Loading users...</p>;
  return (
    <div className=" p-5 max-w-[540px] w-[100%]">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estimate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Time (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter estimated time"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="low" value="Low">
                    Low
                  </SelectItem>
                  <SelectItem key="medium" value="Medium">
                    Medium
                  </SelectItem>
                  <SelectItem key="high" value="High">
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <FormField
            control={form.control}
            name="assignedUserId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Assign to" />
                </SelectTrigger>
                <SelectContent>
                  {users?.items.map((user: IUserResponse) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {`${user.firstName} ${user.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.items.map((project: IProjectResponse) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <Button
            type="submit"
            className="mt-5 rounded-none border border-[#4B626D] bg-[#5C7CFA] hover:bg-[#4CAF50] cut cut-left-5 cut-right-5"
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

export default TaskForm;
