'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import {
  TTestRelationsLocalized,
  updateTestCompleted,
} from '@/db/queriesTests';
import { ELanguage } from '@/models/language.model';
import { useEffect, useState } from 'react';
import Fieldset from './Fieldset';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
} from 'motion/react';

import { ArrowRight } from 'lucide-react';
import { TESTS_EXECUTION } from '@/models/tests.model';

interface IProps {
  test: TTestRelationsLocalized;
  lang: ELanguage;
  isAdmin: boolean;
}

const {
  startBtnCaption,
  dialogDescription,
  closeBtnCaption,
  nextBtnCaption,
  conclusionBtnCaption,
  conclusionTitle,
  fieldsetConclusionLegend,
} = TESTS_EXECUTION;

const COLORS_TOP = ['#13FFAA', '#1E67C6', '#CE84CF', '#DD335C'];

export default function TestExecution({ test, lang, isAdmin }: IProps) {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    });
  }, []);

  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`2px 4px 24px ${color}`;

  if (!test) return null;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <motion.button
          style={{
            border,
            boxShadow,
          }}
          whileHover={{
            scale: 1.015,
          }}
          whileTap={{
            scale: 0.985,
          }}
          className="group relative font-georgia flex w-fit items-center gap-6 rounded-full bg-indigo-950/80 px-12 py-2 text-gray-50 transition-colors hover:bg-indigo-950"
        >
          {startBtnCaption[lang]}
          <ArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
        </motion.button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-4xl max-h-dvh overflow-y-auto flex flex-col">
        <TestModalContent test={test} lang={lang} isAdmin={isAdmin} />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function TestModalContent({
  test,
  lang,
  isAdmin,
}: {
  test: TTestRelationsLocalized;
  lang: ELanguage;
  isAdmin: boolean;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [selectedAnswerRating, setSelectedAnswerRating] = useState<
    number | null
  >(null);

  if (!test) return null;

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;

  const handleAnswerSelect = (answerId: number, rating: number) => {
    setSelectedAnswerId(answerId);
    setSelectedAnswerRating(rating);
    setProgress(((currentQuestionIndex + 1) / test.questions.length) * 100);
  };

  const handleNextQuestion = () => {
    if (selectedAnswerRating !== null) {
      setTotalScore(totalScore + selectedAnswerRating);
    }

    setSelectedAnswerId(null);
    setSelectedAnswerRating(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleShowResult = async () => {
    if (selectedAnswerRating !== null) {
      setTotalScore(totalScore + selectedAnswerRating);
    }
    setShowResult(true);

    await updateTestCompleted(test.id, isAdmin);
  };

  const getConclusion = () => {
    const conclusion = test.conclusions.find(
      (c) => totalScore >= c.minRank && totalScore <= c.maxRank
    );
    return conclusion ? conclusion : test.conclusions[0];
  };

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-base opacity-70">
          {test.title}
        </AlertDialogTitle>

        {!showResult && (
          <>
            <AlertDialogDescription>
              {dialogDescription[lang]}
            </AlertDialogDescription>

            <Progress
              value={progress}
              className="h-2"
              indicatorClassName="bg-gradient-to-r from-emerald-200 to-emerald-800"
            />
          </>
        )}

        <h2 className="text-center font-georgia text-xl font-semibold p-4 text-tertiary-foreground">
          {!showResult
            ? `🔹 ${currentQuestion.title} 🔹`
            : conclusionTitle[lang]}
        </h2>
        {!showResult ? (
          currentQuestion.answers.map((answer) => (
            <Button
              key={answer.id}
              onClick={() => handleAnswerSelect(answer.id, answer.rating)}
              variant={selectedAnswerId === answer.id ? 'default' : 'outline'}
              className="whitespace-normal h-fit py-2 shadow-md"
            >
              {answer.text}
            </Button>
          ))
        ) : (
          <Fieldset
            legendText={fieldsetConclusionLegend[lang]}
            className="p-4 font-georgia"
          >
            <p>{getConclusion().description}</p>
          </Fieldset>
        )}
      </AlertDialogHeader>

      <AlertDialogFooter className="items-center gap-x-4">
        <AlertDialogCancel>{closeBtnCaption[lang]}</AlertDialogCancel>

        {!showResult && (
          <Button
            type="button"
            disabled={selectedAnswerId === null}
            className="overflow-hidden rounded relative inline-flex group items-center justify-center px-8 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-emerald-700 active:shadow-none shadow-lg bg-gradient-to-tr from-emerald-700 to-emerald-600 border-emerald-800 text-white"
            // className="overflow-hidden rounded relative inline-flex group items-center justify-center px-8 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-purple-600 active:shadow-none shadow-lg bg-gradient-to-tr from-purple-600 to-purple-500 border-purple-700 text-white"
            onClick={isLastQuestion ? handleShowResult : handleNextQuestion}
          >
            <span className="absolute size-0 group-hover:size-48 transition-all duration-300 ease-out bg-white rounded-full opacity-10"></span>
            <span className="relative">
              {isLastQuestion && selectedAnswerId !== null
                ? conclusionBtnCaption[lang]
                : nextBtnCaption[lang]}
            </span>
          </Button>
        )}
      </AlertDialogFooter>
    </>
  );
}
