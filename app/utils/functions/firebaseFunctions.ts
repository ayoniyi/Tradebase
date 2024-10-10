import { useMutation, useQuery } from "@tanstack/react-query";
import { collection, query, getDocs, where, addDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import upload from "../upload";

// fetch docs
export const useDocsQuery = (queryKey: any, docsCollectionRef: any) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getDocs(docsCollectionRef).then((res) => {
        return res;
      }),
  });
};

//mutate docs
export const useSetDoc = (
  docsCollectionRef: any,
  successFunction: any | null
) => {
  return useMutation({
    mutationFn: async (info: any) => addDoc(docsCollectionRef, info),
    onError: (err) => {
      console.log("err", err);
      toast.error("Sorry, an error occured.", {
        duration: 6500,
      });
    },

    onSuccess: (res) => {
      console.log("app res", res);
      // user update payload
      successFunction();
    },
  });
};

//upload image
export const useFileUpload = (
  upFile: any,
  progress: any,
  successFunction: any | null
) => {
  return useMutation({
    mutationFn: async () => upload(upFile, progress),
    onError: (err) => {
      console.log("err", err);
      toast.error("Sorry, an error occured", {
        duration: 6500,
      });
    },
    onSuccess: (res) => {
      //
      successFunction();
    },
  });
};
