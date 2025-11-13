import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AppButton from "@/components/ui/appButton";
import { logoutUser } from "@/data/auth";
import { router } from "expo-router";

export default function ProfileScreen() {
    return <ThemedView>

        <AppButton type="cancel" onPress={()=> {
            logoutUser();
            router.replace("/(auth)/login");
        }} >
            <ThemedText style ={{color : "#fff"}}> Logout </ThemedText>
        </AppButton>
    </ThemedView>
}