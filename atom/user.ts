import { user } from "@/constants/definations";
import { atom } from "jotai";

export const userAtom = atom< user | null>(null);