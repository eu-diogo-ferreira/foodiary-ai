import * as FileSystem from 'expo-file-system';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "../services/http-client";

type CreatedMealResponse = {
  mealId: string;
  presignedUrl: string;
}

type CreateMealParams = {
  fileType: 'audio/m4a' | 'image/jpeg';
  onSuccess: (mealId: string) => void;
}

export function useCreateMeal({ fileType, onSuccess }: CreateMealParams) {
  const queryClient = useQueryClient();

  const { mutateAsync: createMeal, isPending: isLoading } = useMutation({
    mutationFn: async (uri: string) => {
      const { data } = await httpClient.post<CreatedMealResponse>('/meals', {
        fileType,
      });

      await FileSystem.uploadAsync(data.presignedUrl, uri, {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });

      return { mealId: data.mealId };
    },
    onSuccess: ({ mealId }) => {
      onSuccess(mealId);
      queryClient.refetchQueries({ queryKey: ['meals'] });
    },
  });

  return { createMeal, isLoading }
}