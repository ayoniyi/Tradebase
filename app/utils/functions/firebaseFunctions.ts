import { useMutation, useQuery } from "@tanstack/react-query";
import {
  collection,
  query,
  getDocs,
  where,
  addDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import upload from "../upload";

// fetch docs
export const useDocsQuery = (queryKey: any, docsCollectionRef: any) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getDocs(docsCollectionRef).then((res: any) => {
        return res;
      }),
  });
};
export const fetchDocsQuery = (queryKey: any, docsCollectionRef: any) => {
  return useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getDocs(docsCollectionRef).then((res: any) => {
        //return res;
        const docList = res?.docs.map((doc: any) => ({
          ...doc.data(),
          userId: doc.id,
        }));

        return docList;
      }),
  });
};

// fetch single doc
export const useDocQuery = (
  queryKey: any,
  docsCollectionRef: any,
  interval: any
) => {
  return useQuery({
    queryKey: queryKey,
    queryFn: () =>
      getDoc(docsCollectionRef).then((res: any) => {
        return res;
      }),
    refetchInterval: interval, // 10 seconds
  });
};

//add doc mutation
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
      console.log("app res", res?.id);

      successFunction();
      return res;
    },
  });
};

// add notification
export const addNotification = async (
  receiverId: any,
  notification: any,
  db: any
) => {
  const notificationsRef = collection(db, "users", receiverId, "notifications");
  await addDoc(notificationsRef, notification);
};

//update doc mutation
export const useUpdateDoc = (
  docsCollectionRef: any,
  successFunction: any | null
) => {
  return useMutation({
    mutationFn: async (info: any) => updateDoc(docsCollectionRef, info),
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
