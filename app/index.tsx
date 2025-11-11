import { ThemedTextInput } from "@/components/themed-input";
import { ThemedText } from "@/components/themed-text";
import { ThemedTile } from "@/components/themed-tile";
import { ThemedView } from "@/components/themed-view";
import AppButton from "@/components/ui/appButton";
import { useNavigation } from "expo-router";
import { Formik } from "formik";
import { StyleSheet } from "react-native";
import * as Yup from "yup";



const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('required'),
    password: Yup.string().min(6, 'Too Short!').max(20, 'Too Long!').required('required'),
});

export default function LoginScreen() {
    const navigation = useNavigation();
    return <ThemedView style={styles.container}>
        <ThemedText style={styles.title} type="title">
            Login
        </ThemedText>
        <ThemedTile style={styles.form} >
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={values => console.log(values)}
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
                            <ThemedText type="subtitle">Login</ThemedText>
                        </AppButton>
                        <ThemedText style={{textAlign: "center"}} type="link" onPress={()=> navigation.navigate("signup")} >Register your account</ThemedText>
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