import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <View style={styles.container}>
            <Header />
            <View >
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

});

export default Layout;