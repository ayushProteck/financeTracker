import { confirmDetails } from "@/atom/global";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAtom } from "jotai";
import { Modal, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedTile } from "../themed-tile";
import AppButton from "./appButton";

export type AppConfirmProps = {
    type?: "update" | "delete" | "success";
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
};

export default function AppConfirm() {
    const [{type , visible, title, message, onClose, onConfirm}] = useAtom(confirmDetails);
    const iconName = () => {
        switch (type) {
            case "update":
                return "info";
            case "delete":
                return "warning";
            case "success":
                return "check-circle";
            default:
                return "info";
        }
    }

    const iconColor = () => {
        switch (type) {
            case "update":
                return "#3d9bffff";
            case "delete":
                return "orange";
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
            <ThemedText style={{marginTop: 20}} type="subtitle">{title}</ThemedText>
            <ThemedText style={{textAlign: "center" , marginTop: 20}} type="defaultSemiBold" >{message}</ThemedText>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: "100%",
                    marginTop: 20

                }}
            >
            <AppButton
            type= {type === "delete"? "cancel" : "primary" }
            style={{
                width: "45%"
            }}
            onPress={(event) => {
                onConfirm();
                event.persist();
            }}
            >
                <ThemedText
                    type="defaultSemiBold"
                    style={{ color: "#fff" }}
                >
                    Yes
                </ThemedText>
            </AppButton>
            <AppButton
            type= {"secondary"}
            style={{
                width: "45%"
            }}
            onPress={onClose}
            >
                <ThemedText
                    type="defaultSemiBold"
                    style={{ color: "#fff" }}
                >
                    No
                </ThemedText>
            </AppButton>
            </View>
        </ThemedTile>
        </View>
    </Modal>;
}

