import { user } from "@/constants/definations";
import { atom } from "jotai";

export const currentUser = atom< user | null>(null);
export const storedUsers = atom<user[]>([]);