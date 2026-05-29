import {
    View,
    SafeAreaView,
    StyleSheet,
    FlatList,
    Text,
    Image,
    TouchableOpacity,
    Linking,
    Alert,
} from "react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import { sosApi } from "../../store/SosSlices";

const SosScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const SOSLIST = useSelector((state) => state.sos.sos) ?? [];
    const LOADING = useSelector((state) => state.sos.loading);

    useEffect(() => {
        dispatch(sosApi());
    }, []);

    const handleCall = (number) => {
        const cleaned = number.replace(/\s+/g, "");
        Linking.openURL(`tel:${cleaned}`).catch(() =>
            Alert.alert("Error", "Unable to make the call.")
        );
    };

    const _renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.imageWrapper}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.contacts}>
                    {item.contact.map((c, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.callBtn}
                            onPress={() => handleCall(c.contact)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.callIcon}>📞</Text>
                            <Text style={styles.callNumber}>{c.contact}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <AppbarHeader title="SOS" back={true} home={true} navigation={navigation} />
            {LOADING && SOSLIST.length === 0 ? (
                <ActivityIndicator
                    animating={true}
                    color={MD2Colors.red400}
                    size={40}
                    style={{ marginTop: 40 }}
                />
            ) : (
                <FlatList
                    data={SOSLIST}
                    renderItem={_renderItem}
                    keyExtractor={(item) => String(item.id)}
                    numColumns={1}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8",
        paddingHorizontal: 4,
    },
    list: {
        padding: 16,
        paddingBottom: 24,
        gap: 12,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        alignItems: "center",
    },
    imageWrapper: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: "#eee",
    },
    info: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
    },
    title: {
        fontSize: 13,
        fontWeight: "700",
        color: "#222",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.3,
    },
    contacts: {
        gap: 6,
    },
    callBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e8f5e9",
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignSelf: "flex-start",
        marginBottom: 4,
    },
    callIcon: {
        fontSize: 13,
        marginRight: 5,
    },
    callNumber: {
        fontSize: 13,
        color: "#1b5e20",
        fontWeight: "600",
    },
});

export default SosScreen;
