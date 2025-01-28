'use client';

import { NewTag, TTag } from '@/db/schema';
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

const formSchema = z.object({
  nameUa: z.string().min(2).max(50).trim(),
  nameEn: z.string().min(2).max(50).trim(),
  slug: z.string().min(2).max(50).toLowerCase().trim(),
});

const ModalTagUpdate: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (tag: NewTag) => Promise<void>;
  tag?: TTag;
  removeTag?: (tagId: number) => Promise<void>;
}> = ({ open, setOpen, onSubmit, tag, removeTag }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: tag || { nameUa: '', nameEn: '', slug: '' }, // Set default values if tag exists
  });

  const slugRefreshHandler = () =>
    form.setValue('slug', makeSlug(form.getValues().nameEn));

  const isLoading = form.formState.isSubmitting;

  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(values);

      form.reset();
    } catch (error) {
      toast.error(
        `Failed to ${tag ? 'Update' : 'Add'} Tag! Error: ${(error as Error).message}`
      );
    }
  };

  return (
    <>
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
                {removeTag && (
                  <Button
                    type="button"
                    variant="destructive"
                    title="Delete Tag"
                    onClick={() => setOpenDeleteModal(true)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}

                <Button
                  title="Clean All Fields"
                  type="button"
                  onClick={() => form.reset()}
                  variant="outline"
                >
                  <Cleaner className="size-6" />
                </Button>

                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : tag ? 'Save Changes' : 'Add Tag'}
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      {removeTag && (
        <ConfirmDialog
          open={openDeleteModal}
          onOpenChange={setOpenDeleteModal}
          title="Delete Tag"
          description={
            <>
              Are you sure you want to delete this tag?
              <br />
              <b>{tag?.nameEn}</b>
            </>
          }
          confirmBtnCaption="Delete"
          cancelBtnCaption="Cancel"
          onConfirm={() => {
            if (tag) removeTag(tag.id);
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ModalTagUpdate;
