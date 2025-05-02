// src/hooks/useQuery.ts
import { useState, useEffect } from "react";

export function useQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = []
): [T | null, Error | null, () => void, boolean] {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await queryFn();
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      setData(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return [data, error, fetchData, isLoading];
}
