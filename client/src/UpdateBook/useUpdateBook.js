import { updateBook } from "../api"
import { useMutation } from "react-query"

export const useUpdateBook = () => {
  const { mutateAsync, isLoading: isMutating } = useMutation(updateBook);
  return { mutateAsync, isMutating }
}