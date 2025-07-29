import React from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";
import { useLoading } from "../context/LoadingContext";

export const GlobalLoader = () => {
    const { loadingSubmit } = useLoading();

    return (
        <Modal visible={loadingSubmit} transparent animationType="fade">
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
});
