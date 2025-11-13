import { AppAlertProps } from "@/components/ui/appAlert";
import { AppConfirmProps } from "@/components/ui/appConfirm";
import { atom } from "jotai";



export const alertDetails = atom<AppAlertProps>({
    type: "info",
    visible: false,
    title: "",
    message: "",
    onClose: () => {}
});

export const confirmDetails = atom<AppConfirmProps>({
    type: "update",
    visible: false,
    title: "",
    message: "",
    onClose: () => {},
    onConfirm: () => {},
})