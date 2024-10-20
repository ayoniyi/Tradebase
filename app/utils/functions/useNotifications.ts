"use client";
import { useCallback, useEffect, useRef } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../firebase";

const useNotifications = (currentUserId: any) => {
  // let soundBite = new Audio("/bite.mp3");
  // if (currentUserId) {
  //   const notificationsRef = collection(
  //     db,
  //     "users",
  //     currentUserId,
  //     "notifications"
  //   );
  //   const unSub = onSnapshot(notificationsRef, (snapshot) => {
  //     snapshot.docChanges().forEach((change) => {
  //       if (change.type === "added") {
  //         console.log("New notification!", change.doc.data());
  //         soundBite.play();
  //         toast("New notification \n\n" + change.doc.data().message, {
  //           duration: 4500,
  //         });
  //       }
  //     });
  //   });

  //   return () => unSub();
  // }

  const handleSnapshot = useCallback(
    (snapshot: any) => {
      snapshot.docChanges().forEach((change: any) => {
        if (change.type === "added") {
          //soundBite.play();
          console.log("New notification!", change.doc.data());
          toast("New notification \n\n" + change.doc.data().message, {
            duration: 4500,
          });
        }
      });
    },
    [] // This ensures that `handleSnapshot` is memoized and doesn't cause re-renders
  );

  useEffect(() => {
    if (currentUserId) {
      const unsubscribe = onSnapshot(
        collection(db, "users", currentUserId, "notifications"),
        handleSnapshot
      );

      return () => unsubscribe();
    }
  }, [handleSnapshot]); // Only re-run if userId or db changes
};

export default useNotifications;
