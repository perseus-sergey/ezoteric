import { motion } from 'motion/react';

import { ELanguage } from '@/models/language.model';
import { CHAT_MODEL } from '@/models/chat.model';
import { Osaka } from '@/svg/Osaka';

const { overviewText } = CHAT_MODEL;

export const Overview = ({ lang }: { lang: ELanguage }) => {
  return (
    <motion.div
      key="overview"
      // className="max-w-[500px] mt-10 mx-4 md:mx-0"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="bg-tertiary text-sm w-full p-4 flex items-center gap-4">
        <Osaka className="size-6" />

        <p>{overviewText[lang]}</p>
      </div>
    </motion.div>
  );
};
