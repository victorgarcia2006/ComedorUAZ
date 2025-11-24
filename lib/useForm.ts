import { useState } from "react";
import { db } from "@/lib/firebaseClient";
import { ref, set} from "firebase/database";
import { FormData } from "../pages/admin/index";

export function useFirebaseForm(path: string) {
  const [loading, setLoading] = useState(false);

  const submitForm = async (data: FormData) => {
    setLoading(true);
    try {
      const itemsRef = ref(db, path);
      await set(itemsRef, data);
      return { ok: true };
    } catch (error: any) {
      console.error("Firebase Error:", error);
      return { ok: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading };
}