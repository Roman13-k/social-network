import { RefObject, useEffect, useRef } from "react";

interface UseObserverOptions extends IntersectionObserverInit {
  observeChildren?: boolean;
}

export function useObserver(
  callback: () => void,
  loading: boolean,
  ref: RefObject<HTMLDivElement | HTMLUListElement | HTMLLIElement | null>,
  options?: UseObserverOptions,
) {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (loading || !ref?.current) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    const element = ref.current;
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, options);

    if (options?.observeChildren) {
      Array.from(element.children).forEach((child) => observer.current?.observe(child));
    } else {
      observer.current.observe(element);
    }

    return () => {
      if (!observer.current) return;
      if (options?.observeChildren) {
        Array.from(element.children).forEach((child) => observer.current?.unobserve(child));
      } else {
        observer.current.unobserve(element);
      }
    };
  }, [ref, options, loading, callback]);
}
