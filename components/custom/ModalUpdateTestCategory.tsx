'use client';

import { TNewTestCategory, TTestCategory } from '@/db/schema';
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
import { makeSlug } from '@/controllers/articleEdit.controller';
import { GenerateText } from '@/svg/GenerateText';
import { Cleaner } from '@/svg/Cleaner';
import { Trash2 } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  slug: z.string().min(2).max(50).toLowerCase().trim(),
  nameUa: z.string().min(2).max(50).trim(),
  nameEn: z.string().min(2).max(50).trim(),
  descriptionUa: z.string().max(640).min(10).trim(),
  descriptionEn: z.string().max(640).min(10).trim(),
});

const ModalUpdateTestCategory: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (category: TNewTestCategory) => Promise<void>;
  deleteCategory?: (categoryId: number) => Promise<void>;
  category?: TTestCategory;
}> = ({ open, setOpen, onSubmit, category, deleteCategory }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      nameUa: '',
      nameEn: '',
      descriptionUa: '',
      descriptionEn: '',
      slug: '',
    }, // Set default values if category exists
  });

  const slugRefreshHandler = () =>
    form.setValue('slug', makeSlug(form.getValues().nameEn));

  const isLoading = form.formState.isSubmitting;
  const cleanForm = () => {
    form.setValue('nameEn', '');
    form.setValue('nameUa', '');
    form.setValue('descriptionUa', '');
    form.setValue('descriptionEn', '');
    form.setValue('slug', '');
  };

  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);

      cleanForm();
    } catch (error) {
      toast.error(
        `Failed to ${category ? 'Update' : 'Add'} category! Error: ${error}`
      );
    }
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="sm:max-w-[425px] max-h-dvh sm:max-h-[90dvh] space-y-4 overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {category ? 'Edit Category' : 'Add Category'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {category
                ? 'Make changes to the category details.'
                : 'Add a new category.'}
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
                name="descriptionUa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ukrainian Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Опис українською" {...field} />
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
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description in English"
                        {...field}
                      />
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
                    <div className="w-full flex items-center gap-4">
                      <FormControl>
                        <Input placeholder="slug" {...field} />
                      </FormControl>

                      <Button
                        title="Generate Slug"
                        type="button"
                        onClick={slugRefreshHandler}
                        variant="outline"
                      >
                        <GenerateText className="size-6 opacity-50" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialogFooter>
                {deleteCategory && (
                  <Button
                    disabled={isLoading}
                    type="button"
                    variant="destructive"
                    title="Delete Category"
                    onClick={() => setOpenDeleteModal(true)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}

                <Button
                  title="Clean All Fields"
                  type="button"
                  onClick={cleanForm}
                  variant="outline"
                >
                  <Cleaner className="size-6" />
                </Button>

                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="duration-500"
                >
                  {isLoading
                    ? 'Saving...'
                    : category
                      ? 'Save Changes'
                      : 'Add Category'}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      {deleteCategory && openDeleteModal && category && (
        <ConfirmDialog
          open={openDeleteModal}
          onOpenChange={setOpenDeleteModal}
          title="Delete Category"
          description={
            <>
              Are you sure you want to delete this category?
              <br />
              <b>{category?.nameEn}</b>
            </>
          }
          confirmBtnCaption="Delete"
          cancelBtnCaption="Cancel"
          onConfirm={() => {
            deleteCategory(category.id);
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ModalUpdateTestCategory;
