import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, ScrollView, useWindowDimensions, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import logoImage from './assets/images/adaptive-icon.png';

const Header = () => {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[styles.header, isMobile && styles.headerMobile]}>
                <View style={styles.logoContainer}>
                    <Image source={logoImage} style={styles.logo} alt="" />
                    <Text style={styles.logoText}>MyApp</Text>
                </View>

                <ScrollView
                    horizontal={!isMobile}
                    contentContainerStyle={[styles.navLinks, isMobile && styles.navLinksMobile]}
                    showsHorizontalScrollIndicator={false}
                >
                    <Link href="/" asChild>
                        <Pressable accessibilityRole="button">
                            <Text style={styles.navLinkText}>Home</Text>
                        </Pressable>
                    </Link>
                    <Link href="/about" asChild>
                        <Pressable accessibilityRole="button">
                            <Text style={styles.navLinkText}>About</Text>
                        </Pressable>
                    </Link>
                    <Link href="/product" asChild>
                        <Pressable accessibilityRole="button">
                            <Text style={styles.navLinkText}>Products</Text>
                        </Pressable>
                    </Link>
                </ScrollView>

                {/* CTA Button */}
                <Link href="/get-started" asChild>
                    <Pressable style={styles.ctaButton}>
                        <Text style={styles.ctaButtonText}>Get Started</Text>
                    </Pressable>
                </Link>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerMobile: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    navLinks: {
        flexDirection: 'row',
        gap: 20,
    },
    navLinksMobile: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
    },
    navLinkText: {
        fontSize: 16,
        color: '#333',
    },
    ctaButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 10,
    },
    ctaButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Header;
