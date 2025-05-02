// src/hooks/useMutation.ts
import { useState } from "react";
import { AxiosError } from "axios";

type ApiError = AxiosError<{ message?: string }>;

export function useMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<T>
): [(variables: V) => Promise<T>, boolean, T | null, ApiError | null] {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (variables: V) => {
    setIsLoading(true);
    try {
      const result = await mutationFn(variables);
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      const error = err as ApiError;
      setError(error);
      setData(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return [mutate, isLoading, data, error];
}
