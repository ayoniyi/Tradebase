import { useQuery } from "@tanstack/react-query";
import { collection, query, getDocs, where } from "firebase/firestore";

export const useDocsQuery = (queryKey: string, docsCollectionRef: any) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getDocs(docsCollectionRef).then((res) => {
        return res;
      }),
  });
};
