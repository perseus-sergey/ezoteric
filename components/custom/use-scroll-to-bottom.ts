import { useEffect, useRef, RefObject } from 'react';

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T | null>,
  RefObject<T | null>,
] {
  const containerRef = useRef<T>(null);
  const endRef = useRef<T>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        console.log('🚀 ~ observer ~ observer:', observer);
        end.scrollIntoView({ behavior: 'instant', block: 'end' });
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  return [containerRef, endRef];
}
// export function useScrollToBottom<T extends HTMLElement>(): [React.RefObject<T>, React.RefObject<T>] {
//   const containerRef = useRef<T>(null);
//   const endRef = useRef<T>(null);

//   useLayoutEffect(() => {
//       const container = containerRef.current;
//       const end = endRef.current;

//       if (container && end) {
//           setTimeout(() => {
//               end.scrollIntoView({ behavior: "smooth", block: "end" });
//           }, 0);
//       }
//   }, [messages]); // messages додано до залежностей

//   return [containerRef, endRef];
// }
