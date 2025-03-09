import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay: number = 300): T {
  const [returnValue, setReturnValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setReturnValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return returnValue;
}

export default useDebounce;
