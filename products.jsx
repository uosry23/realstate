import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import productImage from './assets/images/favicon.png';

const products = [
    { id: 1, name: 'Product 1', description: 'Short desc', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', description: 'This is a very long description that might cause layout issues if not handled properly.', image: '' },
    { id: 3, name: 'Product 3', description: '', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Product 4', description: 'Another product', image: 'https://invalid-url.com/image.png' },
    { id: 5, name: 'Product 5', description: 'No image here', image: 'https://via.placeholder.com/150' },
];

const ProductItem = ({ item }) => {
    const truncatedDescription = item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description;
    // const imageSource = item.image ? { uri: item.image } : require('./placeholder.png');

    return (
        <View style={styles.itemContainer}>
            <Image source={productImage} style={styles.image} alt={item.name} onError={() => console.log('Image failed to load')} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{truncatedDescription || 'No description available'}</Text>
        </View>
    );
};

const product = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>   <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProductItem item={item} />}
            />
        </View></SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
    itemContainer: { backgroundColor: '#fff', padding: 16, marginBottom: 12, borderRadius: 8, elevation: 2 },
    image: { width: '100%', height: 150, resizeMode: 'cover', marginBottom: 8, borderRadius: 4 },
    name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    description: { fontSize: 14, color: '#666' },
});

export default product;
