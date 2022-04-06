import useSWR, { SWRConfiguration } from "swr"
import { ProductType } from "../interfaces/products"

// const fetcher = (...args: [key: string]) =>
//   fetch(...args).then((res) => res.json())

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
  // const { data, error } = useSWR(`/api${url}`, fetcher, config) as {
  //   data: T[]
  //   error: unknown
  // }
  const { data, error } = useSWR(`/api${url}`, config)
  return {
    products: data ?? [],
    isLoading: !error && !data,
    isError: error,
  }
}
