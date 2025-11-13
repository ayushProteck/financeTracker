import { alertDetails } from "@/atom/global";
import { ThemedTextInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedTile } from "@/components/themed-tile";
import { ThemedView } from "@/components/themed-view";
import AppButton from "@/components/ui/appButton";
import { signUpUser } from "@/data/auth";
import { Link, useNavigation } from "expo-router";
import { Formik } from "formik";
import { useAtom } from "jotai";
import { StyleSheet } from "react-native";
import * as Yup from "yup";



const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('required'),
    password: Yup.string().min(6, 'Too Short!').max(20, 'Too Long!').required('required'),
});

export default function SignUpScreen() {
    const navigation = useNavigation();

    const [alert, setAlert] = useAtom(alertDetails);
    const handleSignUp = async (value : any) => {
        const res = await signUpUser(value.email , value.password);
        if(res.success){
            navigation.navigate("login");
        } else {
            setAlert({
                type: "error",
                visible: true,
                title: "SignUp Failed",
                message: "User already exists",
                onClose: () => setAlert(prev => ({...prev, visible: false}))
            });
        }

    }

    return <ThemedView style={styles.container}>
        <ThemedText style={styles.title} type="title">
            SignUp
        </ThemedText>
        <ThemedTile style={styles.form} >
            <Formik
                initialValues={{ email: '', password: '' , confirmPassword: ''}}
                onSubmit={handleSignUp}
                validationSchema={LoginSchema}>
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <>    
                        <ThemedTextInput 
                            placeholder="Email*"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        {errors.email ? <ThemedText type="error" >{errors.email}</ThemedText> : 
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
                        <ThemedTextInput 
                            placeholder="Confirm Password*"
                            secureTextEntry
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            value={values.confirmPassword}
                        />
                        {errors.confirmPassword ? <ThemedText type="error" >
                                {errors.confirmPassword}
                                </ThemedText> : <ThemedText type="default"></ThemedText>}
                        <AppButton onPress={handleSubmit as any}>
                            <ThemedText type="subtitle" style={{color: "#fff"}}>SignUp</ThemedText>
                        </AppButton>
                        <Link style={{ textAlign: "center" }} href={"/"} >
                            <ThemedText type="link" onPress={()=> navigation.navigate("index")} >Already have an account?</ThemedText>
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