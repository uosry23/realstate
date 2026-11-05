import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, } from 'react-native';
import { Link } from 'expo-router';
import Header from './Header';
import { ImageBackground } from 'react-native-web';
import heroImage from './assets/images/e2a97633-ea35-45c2-bb2e-b44ed453c944.png';

const HomeScreen = () => {
  return (
    <View style={styles.main}>
      <Header />

      <ImageBackground
        source={heroImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Welcome to Our App</Text>
            <Text style={styles.heroSubtitle}>A short description of the app&apos;s purpose.</Text>
            <Link href="/product">
              <Pressable style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>show our products</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>

  );
};

const styles = StyleSheet.create({
  main: { flex: 1, justifyContent: 'center', flexDirection: 'column' },
  container: {
    flexGrow: 1,
    padding: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
