import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, Control } from 'react-hook-form';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { cn } from '@/lib/utils/utils';
import { TTestFormValues } from '@/models/editArticle.model';
import { Textarea } from '../ui/textarea';

export function QuestionsBlock({
  control,
}: {
  control: Control<TTestFormValues>;
}) {
  const {
    fields: questions,
    remove: removeQuestion,
    move: moveQuestion,
    append: addQuestion,
  } = useFieldArray({
    control,
    name: 'questions',
  });

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = questions.findIndex((q) => q.id === active.id);
            const newIndex = questions.findIndex((q) => q.id === over?.id);
            moveQuestion(oldIndex, newIndex);
          }
        }}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((q, qIndex) => (
            <SortableItem key={q.id} id={q.id} className="bg-secondary/30">
              <FormField
                control={control}
                name={`questions.${qIndex}.titleUa`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        Question (UA)
                        <DeleteButton
                          onDelete={() => removeQuestion(qIndex)}
                          deletedItemName="Question"
                        />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Введіть Питання" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`questions.${qIndex}.titleEn`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question (EN)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter question" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AnswersBlock control={control} questionIndex={qIndex} />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        onClick={() =>
          addQuestion({
            titleUa: '',
            titleEn: '',
            answers: [{ textUa: '', textEn: '', rating: 0 }],
          })
        }
      >
        <Plus />
        Add Question
      </Button>
    </>
  );
}

function AnswersBlock({
  control,
  questionIndex,
}: {
  control: Control<TTestFormValues> | undefined;
  questionIndex: number;
}) {
  const {
    fields: answers,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: `questions.${questionIndex}.answers`,
  });

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = answers.findIndex((a) => a.id === active.id);
            const newIndex = answers.findIndex((a) => a.id === over?.id);
            move(oldIndex, newIndex);
          }
        }}
      >
        <SortableContext
          items={answers.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          {answers.map((a, aIndex) => (
            <SortableItem key={a.id} id={a.id} className="bg-secondary">
              <div className="w-full flex items-end justify-center gap-2 flex-wrap md:flex-nowrap">
                <div className="w-full flex items-center gap-2 flex-wrap md:flex-nowrap">
                  <div className="w-full">
                    <FormField
                      control={control}
                      name={`questions.${questionIndex}.answers.${aIndex}.textUa`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-32">
                          <FormLabel>
                            <div className="flex items-center gap-2">
                              Answer (UA)
                              <DeleteButton
                                onDelete={() => remove(aIndex)}
                                deletedItemName="Answer"
                              />
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Введіть Відповідь" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name={`questions.${questionIndex}.answers.${aIndex}.textEn`}
                      render={({ field }) => (
                        <FormItem className="flex-1 min-w-32">
                          <FormLabel>Answer (EN)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter answer" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
                    name={`questions.${questionIndex}.answers.${aIndex}.rating`}
                    render={({ field }) => (
                      <FormItem className="max-w-20">
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button
        className="ml-auto"
        type="button"
        onClick={() => append({ textUa: '', textEn: '', rating: 0 })}
      >
        <Plus />
        Add Answer
      </Button>
    </>
  );
}

export function ConclusionsBlock({
  control,
}: {
  control: Control<TTestFormValues>;
}) {
  const {
    fields: conclusions,
    remove: removeConclusion,
    append: addConclusion,
    move: moveConclusion,
  } = useFieldArray({
    control,
    name: 'conclusions',
  });

  return (
    <>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (active.id !== over?.id) {
            const oldIndex = conclusions.findIndex((c) => c.id === active.id);
            const newIndex = conclusions.findIndex((c) => c.id === over?.id);
            moveConclusion(oldIndex, newIndex);
          }
        }}
      >
        <SortableContext
          items={conclusions.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {conclusions.map((c, cIndex) => (
            <SortableItem key={c.id} id={c.id} className="bg-secondary/30">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`conclusions.${cIndex}.minRank`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Rank</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Min Rank"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`conclusions.${cIndex}.maxRank`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Rank</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Max Rank"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name={`conclusions.${cIndex}.descriptionUa`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        Description (UA)
                        <DeleteButton
                          onDelete={() => removeConclusion(cIndex)}
                          deletedItemName="Conclusion"
                        />
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description (UA)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`conclusions.${cIndex}.descriptionEn`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (EN)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description (EN)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        onClick={() =>
          addConclusion({
            minRank: 0,
            maxRank: 10,
            descriptionUa: '',
            descriptionEn: '',
          })
        }
      >
        <Plus />
        Add Conclusion
      </Button>
    </>
  );
}

interface ISortableItemProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children, className }: ISortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center space-x-2 pb-2 pr-2 my-2 rounded-md shadow-md',
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        {...attributes}
        {...listeners}
        className="cursor-grab px-2"
      >
        <GripVertical size={16} className="opacity-50" />
      </Button>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}

function DeleteButton({
  onDelete,
  deletedItemName,
}: {
  onDelete: () => void;
  deletedItemName: 'Question' | 'Answer' | 'Conclusion';
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ConfirmDialog
        title={`Delete ${deletedItemName}`}
        description={`Are you sure you want to delete this ${deletedItemName}?`}
        confirmBtnCaption="Delete"
        onConfirm={onDelete}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
      <Button
        type="button"
        variant="destructive"
        className="rounded-full size-5 p-0"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="size-3" />
      </Button>
    </>
  );
}
