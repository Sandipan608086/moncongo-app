import { View, SafeAreaView, ScrollView, StyleSheet, Linking, Alert, FlatList, RefreshControl, useWindowDimensions, Share } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Text, ToggleButton, IconButton, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import AppbarHeader from "../../component/Appbar";
import { horoscopeDetailApi, horoscopeOther } from "../../store/HoroscopeSlices";
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import CardListCom from "../../component/CardListCom"
import { mixedStyle } from "./../../Navigation/htmlStyle";
const HoroscopeDetaIlsScreen = ({ navigation, route }, props) => {
    const systemFonts = [...defaultSystemFonts, "Poppins_400Regular",'Poppins_700Bold'];
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();
    const routeData = JSON.parse(route.params);
    // const HOROSCOPEDATA = useSelector(state => state.horoscopes.horoscopeDetail);
    const [HOROSCOPEDATA, setHOROSCOPEDATA] = useState("");
    const HOTHERLIST = useSelector(state => state.horoscopes.horoscopeList);
    const LODING = useSelector(state => state.horoscopes.loading);
    useEffect(() => {
        onRefresh()
        return () => { }
    }, [])
    const onRefresh = () => {
        dispatch(horoscopeDetailApi({ slug: routeData.slug })).then((req) => {
            setHOROSCOPEDATA(req.payload)
            dispatch(horoscopeOther({ slug: routeData.slug }))
        })
    }
    _renderItem = ({ item }) => (
        <View style={{ flex: 1, width: "100%" }}>
            <CardListCom item={item} slug={'HoroscopeDetails'} navigation={navigation} />
        </View>
    )
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: HOROSCOPEDATA.url,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <AppbarHeader title="Horoscope" back={true} home={true} navigation={navigation} />
            <ScrollView
                style={styles.ScrollView}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                horizontal={false}
                refreshControl={
                    <RefreshControl refreshing={LODING} onRefresh={onRefresh} />
                }
            >
                {HOROSCOPEDATA && <View style={styles.ScrollView} >
                    <Text style={styles.Title}>{HOROSCOPEDATA.horo_title}</Text>
                    <Card style={{ marginTop: 20 }}>
                        <Card.Cover style={styles.CardCover} source={HOROSCOPEDATA.horo_main_img != '' ? { uri: HOROSCOPEDATA.horo_main_img } : require("../../assets/noImage.png")} />
                        {HOROSCOPEDATA.horo_start_date && <Text style={styles.date}>Date de publication: {HOROSCOPEDATA.horo_start_date}</Text>}
                    </Card>
                    <Text style={{ fontSize: 20, fontFamily: 'Poppins_700Bold', marginTop: 20 }}>Votre horoscope</Text>
                    <View style={{ backgroundColor: '#ebf8ff', marginTop: 20 }}>
                        {
                            HOROSCOPEDATA.clean_description != '' && (
                                <RenderHtml
                                    contentWidth={width}
                                    source={{ html: HOROSCOPEDATA.clean_description ? HOROSCOPEDATA.clean_description : '' }}
                                    tagsStyles={mixedStyle}
                                    systemFonts={systemFonts}
                                />

                            )
                        }
                    </View>
                    <Text style={{ fontSize: 16, fontFamily: 'Poppins_700Bold', marginTop: 20 }}>VOUS SEREZ ÉGALEMENT INTÉRESSÉ PAR</Text>
                    <View>
                        <FlatList
                            horizontal={true}
                            showsVerticalScrollIndicator={true}
                            showsHorizontalScrollIndicator={false}
                            data={HOTHERLIST}
                            renderItem={this._renderItem}
                            keyExtractor={(item) => item.horo_id}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ padding: 10 }}
                        />
                    </View>
                </View>}
            </ScrollView>
            <FAB
                icon="share"
                style={styles.share}
                color="#ffffff"
                onPress={() => onShare()}
            />
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(248, 248, 248, 1)",
    },
    ScrollView: {
        flex: 1,
        padding: 10,
    },
    Title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        textTransform: 'uppercase'
    },
    CardCover: {
        borderRadius: 0,
        height: 300,
    },
    date: {
        display: 'flex',
        backgroundColor: '#0298d3',
        color: '#ffffff',
        padding: 10
    },
    share: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        alignItems: 'flex-end',
        backgroundColor: '#0298d3'
    },
});
export default HoroscopeDetaIlsScreen;