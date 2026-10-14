import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from './client';

export interface Book {
  id: string;
  title: string;
  description: string;
  category: string;
  visibility: string;
  cover_image: string;
  theme: string;
  owner: number;
  created_at: string;
  updated_at: string;
}

export const useBooks = () => {
  return useQuery({
    queryKey: ['books'],
    queryFn: () => fetchWithAuth('/books/') as Promise<Book[]>,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newBook: Partial<Book>) => 
      fetchWithAuth('/books/', {
        method: 'POST',
        body: JSON.stringify(newBook),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
