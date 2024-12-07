import { TFunction } from "i18next";
import UnleashedCommandExecutor from "./UnleashedCommandExecutor";

export interface ExecutorParams {
    context: UnleashedCommandExecutor;
    endCommand: () => void;
    t?: TFunction & { lng: string };
}