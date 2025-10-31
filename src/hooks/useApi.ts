// src/hooks/useApi.ts
import { useState } from "react";

export function useApi<TArgs extends any[], TResult>(apiFunc: (...args: TArgs) => Promise<TResult>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const call = async (...args: TArgs): Promise<TResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args); // accountApi.login 호출
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { call, loading, error };
}
