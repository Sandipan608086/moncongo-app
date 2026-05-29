import { View, SafeAreaView, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, MD2Colors, FAB } from "react-native-paper";
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import { horoscopeApi } from "../../store/HoroscopeSlices";
import CardComponent from "../../component/CardComponent";
const HoroscopeScreen = ({ navigation, threshold = 100 }) => {
    const g = require("../../Navigation/Style");
    const dispatch = useDispatch();
    const onEndReachedCalledDuringMomentum = useRef(true);
    const [currantPage, setCurrantPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const HOROSCOPELIST = useSelector(state => state.horoscopes.horoscope);
    const LODING = useSelector(state => state.horoscopes.loading);

    const [isVisible, setIsVisible] = useState(false);
    const flatListRef = useRef(null);
    const handleScroll = (event) => {
        const contentOffset = event.nativeEvent.contentOffset;
        setIsVisible(contentOffset.y > threshold);
    };
    const scrollToTop = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
            setIsVisible(false); // Hide button after scrolling to top
        }
    };

    useEffect(() => {
        dispatch(
            horoscopeApi({
                page: currantPage
            })
        )
        setRefreshing(false);
    }, [currantPage, refreshing])
    const onEndReachedHandler = ({ distanceFromEnd }) => {
        if (!onEndReachedCalledDuringMomentum.current) {
            setCurrantPage(currantPage + 1);
            onEndReachedCalledDuringMomentum.current = true
        }
    }
    const _renderItem = ({ item }) => (
        <View style={{ flex: 1, width: "100%" }}>
            <CardComponent item={item} navigation={navigation} button={true} details={'HoroscopeDetails'} />
        </View>
    );
    const renderLoder = () => {
        return (
            LODING && (
                <View>
                    <ActivityIndicator animating={true} color={MD2Colors.blue100} size={40} style={{ marginTop: 30 }} />
                </View>
            )
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <AppbarHeader title="Horoscope" back={true} home={true} navigation={navigation} />
            <FlatList
                ref={flatListRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={true}
                onEndReachedThreshold={0}
                onEndReached={onEndReachedHandler}
                onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false }}
                ListFooterComponent={renderLoder}
                data={HOROSCOPELIST}
                renderItem={_renderItem}
                keyExtractor={(item) => item.id}
                numColumns={1}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20 }}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true)
                    setCurrantPage(1)
                }}
            />
            {/* {isVisible && <FAB
                icon="arrow-up"
                style={styles.fab}
                onPress={scrollToTop}
                color="#ffffff"
            />} */}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(248, 248, 248, 1)",
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        alignItems: 'flex-end',
        backgroundColor: '#0298d3'
    },
});
export default HoroscopeScreen;