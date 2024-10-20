import toast from "react-hot-toast";

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`Text copied to clipboard. `, { duration: 2000 });
    return true;
  } catch (error) {
    //console.error("Failed to copy text to clipboard:", error);
    toast.error(`Failed to copy text to clipboard: ${error}`, {
      duration: 3000,
    });
    return false;
  }
};
