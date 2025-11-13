import { alertDetails } from "@/atom/global";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAtom } from "jotai";
import { Modal, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedTile } from "../themed-tile";
import AppButton from "./appButton";

export type AppAlertProps = {
    type?: "info" | "warning" | "error" | "success";
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
};

export default function AppAlert() {
    const [{type , visible, title, message, onClose}] = useAtom(alertDetails);
    const iconName = () => {
        switch (type) {
            case "info":
                return "info";
            case "warning":
                return "warning";
            case "error":
                return "error";
            case "success":
                return "check-circle";
            default:
                return "info";
        }
    }

    const iconColor = () => {
        switch (type) {
            case "info":
                return "#3d9bffff";
            case "warning":
                return "orange";
            case "error":
                return "red";
            case "success":
                return "green";
            default:
                return "#3d9bffff";  
        }
    }

    return <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View
                style={{
                // height: "100%",
                // width: "100%",
                flex: 1,
                justifyContent: "center", 
                alignItems: "center"
            }}
        >
        <ThemedTile
            style={{
                margin: 20,
                padding: 20,
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
                // alignSelf: "center",
            }}
        >
            <MaterialIcons name={iconName()} color={iconColor()} size={50} />
            <ThemedText type="title">{title}</ThemedText>
            <ThemedText type="defaultSemiBold" >{message}</ThemedText>
            <AppButton
            type= {type === "error"? "cancel" : "primary" }
            onPress={onClose}
            >
                <ThemedText
                    type="defaultSemiBold"
                    style={{ color: "#fff" }}
                >
                    OK
                </ThemedText>
            </AppButton>
        </ThemedTile>
        </View>
    </Modal>;
}

