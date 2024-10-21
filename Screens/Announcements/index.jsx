import {
    View,
    SafeAreaView,
    StyleSheet,
    FlatList,
    Image
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Appbar, Surface, Text, Button, ActivityIndicator, MD2Colors, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import AppbarHeader from "../../component/Appbar"
import { announcementsApi } from "../../store/AnnouncementsSlices"
import CardComponent from "../../component/CardComponent";
const AnnouncementScreen = ({ navigation, threshold = 100 }) => {
    const dispatch = useDispatch();
    const onEndReachedCalledDuringMomentum = useRef(true);
    const [currantPage, setCurrantPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const ANNOUNCLIST = useSelector(state => state.announcement.announcement);
    const LODING = useSelector(state => state.announcement.loading);

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
            announcementsApi({
                page: currantPage
            })
        )
        setRefreshing(false);
    }, [currantPage, refreshing])
    onEndReachedHandler = ({ distanceFromEnd }) => {
        if (!onEndReachedCalledDuringMomentum.current) {
            setCurrantPage(currantPage + 1);
            onEndReachedCalledDuringMomentum.current = true
        }
    }
    _renderItem = ({ item }) => (
        <View style={{ flex: 1, width: "100%" }}>
            <CardComponent item={item} navigation={navigation} button={true} details={'AnnouncementDetails'} />
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
    noItemDisplay = () => {
        return (
            ANNOUNCLIST && (<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}><Image style={{ width: 500, height: 500 }} source={require('../../assets/noData.png')} /></View>)
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <AppbarHeader title="Annonces" back={true} home={true} navigation={navigation} />
            <FlatList
                ref={flatListRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={true}
                onEndReachedThreshold={0}
                onEndReached={this.onEndReachedHandler}
                onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false }}
                ListFooterComponent={renderLoder}
                data={ANNOUNCLIST}
                renderItem={this._renderItem}
                ListEmptyComponent={this.noItemDisplay}
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
        backgroundColor: '#0298d3'
    },
});

export default AnnouncementScreen;