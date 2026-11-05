import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="about" />
            <Stack.Screen name="index" />
            <Stack.Screen name="product" />


        </Stack>
    );
}