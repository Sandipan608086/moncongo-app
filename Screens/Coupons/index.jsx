import { View, SafeAreaView, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import { couponsApi } from "../../store/CouponsSlices";
import CardComponent from "../../component/CardComponent";
const CouponsScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const onEndReachedCalledDuringMomentum = useRef(true);
    const [currantPage, setCurrantPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const COUPONSLIST = useSelector(state => state.coupon.coupons);
    const LODING = useSelector(state => state.coupon.loading);
    useEffect(() => {
        dispatch(
            couponsApi({
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
            <CardComponent item={item} navigation={navigation} button={true} details={'CouponsDetails'} />
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
            <AppbarHeader title="Coupons" back={true} home={true} navigation={navigation} />
            <FlatList
                showsVerticalScrollIndicator={true}
                onEndReachedThreshold={0}
                onEndReached={this.onEndReachedHandler}
                onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false }}
                ListFooterComponent={renderLoder}
                data={COUPONSLIST}
                renderItem={this._renderItem}
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
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(248, 248, 248, 1)",
    },
});
export default CouponsScreen;