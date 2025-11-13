import { TouchableOpacity, TouchableOpacityProps } from "react-native";

export type AppButtonProps = TouchableOpacityProps & {
    type?: 'primary' | 'secondary' | 'cancel';
    size?: 'small' | 'medium' | 'large';
}

export default function AppButton({
    type = 'primary',
    size = 'medium',
    style = {},
    ...rest
} : AppButtonProps) {
    const backgroundColor = backgroundColors[type];
    
    return <TouchableOpacity 
        style={[{
            backgroundColor: backgroundColor, 
            padding: 12, 
            marginTop: 10,
            margin: 5,
            borderRadius: 8, 
            alignItems: 'center',
            
        }, style]}
        {...rest}/>;
}

const backgroundColors: Record<string, string> = {
    primary: '#0a7ea4',
    secondary: '#5a5a5aff',
    cancel: '#ff3b30',
}
