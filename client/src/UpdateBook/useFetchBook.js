import { getBook } from "../api"
import { useQuery } from "react-query"


export const useFetchBook = (id) => {
  const { data, error, isLoading, isError } = useQuery(
    ["book", { id }],
    getBook
  );

  return { data, error, isLoading, isError }
}