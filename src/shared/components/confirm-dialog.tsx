import { View } from "react-native";
import { create } from "zustand";
import { Button, Dialog } from "heroui-native";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

interface ConfirmState {
  options: ConfirmOptions | null;
  open: (options: ConfirmOptions) => void;
  close: () => void;
}

const useConfirmStore = create<ConfirmState>((set) => ({
  options: null,
  open: (options) => set({ options }),
  close: () => set({ options: null }),
}));

/**
 * Confirmation 100 % HeroUI (remplace `Alert.alert`).
 * Le host est monté une seule fois dans le layout racine.
 */
export function confirmAction(options: ConfirmOptions): void {
  useConfirmStore.getState().open(options);
}

export function ConfirmDialogHost() {
  const options = useConfirmStore((state) => state.options);
  const close = useConfirmStore((state) => state.close);

  const confirm = () => {
    const action = options?.onConfirm;
    close();
    action?.();
  };

  return (
    <Dialog
      isOpen={Boolean(options)}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="w-[92%] max-w-md gap-2">
          <Dialog.Title>{options?.title ?? ""}</Dialog.Title>
          {options?.message ? (
            <Dialog.Description>{options.message}</Dialog.Description>
          ) : null}

          <View className="mt-5 flex-row justify-end gap-2">
            <Button variant="ghost" onPress={close}>
              {options?.cancelLabel ?? "Annuler"}
            </Button>
            <Button
              variant={options?.destructive ? "danger" : "primary"}
              onPress={confirm}
            >
              {options?.confirmLabel ?? "Confirmer"}
            </Button>
          </View>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
