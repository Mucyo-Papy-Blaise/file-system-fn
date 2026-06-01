import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { trashApi } from "@/api/trash.api";

const TRASH_UNDO_DURATION_MS = 5000;

export async function invalidateTrashRelatedQueries(queryClient: QueryClient) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: ["trash"] }),
    queryClient.invalidateQueries({ queryKey: ["documents"] }),
    queryClient.invalidateQueries({ queryKey: ["folders"] }),
    queryClient.invalidateQueries({ queryKey: ["collections"] }),
    queryClient.invalidateQueries({ queryKey: ["shared-spaces"] }),
    queryClient.invalidateQueries({ queryKey: ["tray"] }),
  ]);
}

export function showMovedToTrashToast(
  trashItemId: string,
  queryClient: QueryClient,
) {
  toast.success("Moved to trash", {
    duration: TRASH_UNDO_DURATION_MS,
    action: {
      label: "Undo",
      onClick: () => {
        void trashApi
          .restore(trashItemId)
          .then(async () => {
            await invalidateTrashRelatedQueries(queryClient);
            toast.success("Restored");
          })
          .catch(() => {
            toast.error("Could not undo");
          });
      },
    },
  });
}
