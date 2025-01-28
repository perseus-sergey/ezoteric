'use client';

import { NewTag } from '@/db/schema';
import { z } from 'zod';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';

const formSchema = z.object({
  nameUa: z.string().min(2).max(50).trim(),
  nameEn: z.string().min(2).max(50).trim(),
  slug: z.string().min(2).max(50).toLowerCase().trim(),
});

const ModalTagUpdate: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (tag: NewTag) => Promise<void>;
  tag: NewTag | null;
}> = ({ open, setOpen, onSubmit, tag }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: tag || { nameUa: '', nameEn: '', slug: '' }, // Set default values if tag exists
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{tag ? 'Edit Tag' : 'Add Tag'}</AlertDialogTitle>
          <AlertDialogDescription>
            {tag ? 'Make changes to the tag details.' : 'Add a new tag.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="nameUa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ukrainian Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Українська назва" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Name</FormLabel>
                  <FormControl>
                    <Input placeholder="English name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : tag ? 'Save Changes' : 'Add Tag'}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalTagUpdate;
