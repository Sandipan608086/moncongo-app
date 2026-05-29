import { View, SafeAreaView, StyleSheet, FlatList, Image } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, MD2Colors, Text, FAB } from "react-native-paper";
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import { otherListApi } from "../../store/OtherSlices";
import CardComponent from "../../component/CardComponent";

const OtherList = ({ navigation, route, threshold = 100 }) => {
    const dispatch = useDispatch();
    const onEndReachedCalledDuringMomentum = useRef(true);
    const [currantPage, setCurrantPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const routeData = JSON.parse(route.params);
    const OTHERLIST = useSelector(state => state.other.otherList);
    const LODING = useSelector(state => state.other.loading);
    const [listCount, setListCount] = useState(1);

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
        dispatch(otherListApi({ page: currantPage, slug: routeData.slug })).then((req) => {
            setListCount(req.payload.api.count)
        })
        setRefreshing(false);
    }, [currantPage, refreshing])
    const onEndReachedHandler = ({ distanceFromEnd }) => {
        if (!onEndReachedCalledDuringMomentum.current) {
            setCurrantPage(currantPage + 1);
            onEndReachedCalledDuringMomentum.current = true
        }
    }
    const _renderItem = ({ item }) => {
        return <View style={{ flex: 1, width: "100%" }}><CardComponent item={item} navigation={navigation} button={true} details={'OtherDetails'} /></View>
    };
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
            <AppbarHeader title={routeData.name} back={true} home={true} navigation={navigation} />
            {listCount > 0 ? <FlatList
                ref={flatListRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={true}
                onEndReachedThreshold={0}
                onEndReached={onEndReachedHandler}
                onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false }}
                ListFooterComponent={renderLoder}
                data={OTHERLIST}
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
            /> : <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Image alt="image" style={{ width: 500, height: 500 }} source={require('../../assets/noData.png')} /></View>}
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
        backgroundColor: '#0298d3'
    },
});
export default OtherList;