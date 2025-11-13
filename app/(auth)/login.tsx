import { alertDetails } from "@/atom/global";
import { currentUser } from "@/atom/user";
import { ThemedTextInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedTile } from "@/components/themed-tile";
import { ThemedView } from "@/components/themed-view";
import AppButton from "@/components/ui/appButton";
import { getCurrentUser, loginUser } from "@/data/auth";
import { Link, router, useNavigation } from "expo-router";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";



const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('required'),
    password: Yup.string().min(6, 'Too Short!').max(20, 'Too Long!').required('required'),
});

export default function LoginScreen() {
    const navigation = useNavigation();
    const [alert, setAlert] = useAtom(alertDetails);

    const [User , setCurrentUser] = useAtom(currentUser);
    useEffect(()=> {
      const checkUser = async () => {
        const user = await getCurrentUser();
        console.log("Current User: ", user);
        if(user){
          setCurrentUser(user);
          router.replace("/(tabs)/Home");
        }
      }
      checkUser();
    }, [setCurrentUser]);

    const handleLogin = async (value : {email : string , password : string}) => {
        // Handle login logic here
        const res = await loginUser(value.email , value.password);
        if(res.success){
            router.replace("/(tabs)/Home");
        } else {
            setAlert({
                type: "error",
                visible: true,
                title: "Login Failed",
                message: res.alertMessage ? res.alertMessage.message : "An error occurred",
                onClose: () => setAlert(prev => ({...prev, visible: false}))
            });
        }
    }

    return <ThemedView style={styles.container}>
        <ThemedText style={styles.title} type="title">
            Login
        </ThemedText>
        <ThemedTile style={styles.form} >
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={handleLogin}
                validationSchema={LoginSchema}>
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <>    
                        <ThemedTextInput 
                            placeholder="Email*"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        {errors.email ? <ThemedText type="error" >{errors.email}</ThemedText>:
                        <ThemedText type="default"></ThemedText>}
                        <ThemedTextInput 
                            placeholder="Password*"
                            secureTextEntry
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                        />
                        {errors.password ? <ThemedText type="error" >
                                {errors.password}
                                </ThemedText> : <ThemedText type="default"></ThemedText>}
                        <AppButton onPress={handleSubmit as any}>
                            <ThemedText type="subtitle" style={{color : "#fff"}}>Login</ThemedText>
                        </AppButton>
                        <Link style={{textAlign: "center"}} href={"/signup"} >
                            <ThemedText style={{textAlign: "center"}} type="link" onPress={()=> navigation.navigate("signup")}>{"Don't have an account?"}Register here</ThemedText>
                        </Link>
                    </>)}
                        </ Formik>
        </ThemedTile>
    </ThemedView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginTop: 200,
    },
    form: {
        marginTop: 20,
        width: '80%',
        
    }
});