import { Colors } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, router } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

// export const unstable_settings = {
//     initialRouteName : "Home"
// }

export default function Layout(){
    const theme = useColorScheme();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                headerShadowVisible: true,
                headerStyle: {
                  shadowColor: "#333",
                  // shadowOffset: {
                  //     width: 2,
                  //     height: 3
                  // },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 5

                }
            }}
        >
            <Tabs.Screen name="Home" options={{
                    title: "Home",
                    tabBarIcon: ({color , size}) => <MaterialIcons name="home" size={size} color={color} />,
                }} 
            />
            <Tabs.Screen name="Transactions" options={{
                title: "Transactions",
                tabBarIcon: ({color, size}) => <MaterialIcons name="list" size={size} color={color} />,
            }} />
            <Tabs.Screen name="profile" options={{
                title: "Profile",
                tabBarIcon: ({color, size}) => <MaterialIcons name="person" size={size} color={color} />,
            }} />
            <Tabs.Screen name="AddTransaction" options={{
                href: null,
                headerLeft: () => (
            <Pressable
              onPress={() => {
                // Check if there's history to go back within the current stack
                if (router.canGoBack()) {
                  router.back();
                } else {
                  // If no history in the current stack, navigate to a specific route
                  // For example, navigate to the root of the tab or another screen
                  router.replace('/'); // Example: navigate to the home screen
                }
              }}
              style={{ marginLeft: 15 }}
            >
              <MaterialIcons name="arrow-back" size={24} color={theme === "ligth" ? "#000" : "#fff"} />
            </Pressable>
          ),
                headerBackButtonDisplayMode: "default"
            }} />
        </Tabs>
    );
}