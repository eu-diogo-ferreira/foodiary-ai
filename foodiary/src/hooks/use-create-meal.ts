import * as FileSystem from 'expo-file-system';
import { useMutation } from "@tanstack/react-query";
import { httpClient } from "../services/http-client";

type CreatedMealResponse = {
  mealId: string;
  presignedUrl: string;
}

export function useCreateMeal(fileType: 'audio/m4a' | 'image/jpeg') {
  const { mutateAsync: createMeal, isPending: isLoading } = useMutation({
    mutationFn: async (uri: string) => {
      const { data } = await httpClient.post<CreatedMealResponse>('/meals', {
        fileType,
      });

      await FileSystem.uploadAsync(data.presignedUrl, uri, {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });
    },
  });

  return { createMeal, isLoading }
}