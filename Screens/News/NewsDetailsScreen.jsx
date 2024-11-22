import { View, SafeAreaView, ScrollView, StyleSheet, Linking, Alert, FlatList, RefreshControl, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Text, ToggleButton, IconButton, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import AppbarHeader from "../../component/Appbar";
import { newsDetailApi, newsOther } from "../../store/NewsSlices";
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import CardListCom from "../../component/CardListCom"
import { mixedStyle } from "./../../Navigation/htmlStyle";
const NewsDetailsScreen = ({ navigation, route }) => {
    const systemFonts = [...defaultSystemFonts, "Poppins_400Regular",'Poppins_700Bold'];
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();
    const routeData = JSON.parse(route.params);
    // const NEWSDATA = useSelector(state => state.news.newsDetail);
    const [NEWSDATA, setNEWSDATA] = useState("");
    const NOTHERLIST = useSelector(state => state.news.newsList);
    const LODING = useSelector(state => state.news.loading);
    useEffect(() => {
        onRefresh()
        return () => { }
    }, [])
    const onRefresh = () => {
        dispatch(newsDetailApi({ slug: routeData.slug })).then((req) => {
            setNEWSDATA(req.payload)
            dispatch(newsOther({ slug: routeData.slug }))
        })
    }
    _renderItem = ({ item }) => (
        <View style={{ flex: 1, width: "100%" }}>
            <CardListCom item={item} slug={'NewsDetails'} navigation={navigation} />
        </View>
    )
    return (
        <SafeAreaView style={styles.container}>
            <AppbarHeader title="Nouvelles" back={true} home={true} navigation={navigation} />
            <ScrollView
                style={styles.ScrollView}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                horizontal={false}
                refreshControl={
                    <RefreshControl refreshing={LODING} onRefresh={onRefresh} />
                }
            >
                {NEWSDATA && <View style={styles.ScrollView} >
                    <Text style={styles.Title}>{NEWSDATA.news_title}</Text>
                    <Card style={{ marginTop: 20 }}>
                        <Card.Cover style={styles.CardCover} source={NEWSDATA.news_main_img != '' ? { uri: NEWSDATA.news_main_img } : require("../../assets/noImage.png")} />
                        <Text style={styles.date}>Date Nouvelles: {NEWSDATA.news_date}</Text>
                    </Card>
                    <Text style={{ fontSize: 20, fontFamily: 'Poppins_700Bold', marginTop: 20 }}>L’ Nouvelles</Text>
                    <View style={{ backgroundColor: '#ebf8ff', marginTop: 20 }}>
                        {
                            NEWSDATA.clean_description != '' && (
                                <RenderHtml
                                    contentWidth={width}
                                    source={{ html: NEWSDATA.clean_description ? NEWSDATA.clean_description : '' }}
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
                            data={NOTHERLIST}
                            renderItem={this._renderItem}
                            keyExtractor={(item) => item.news_id}
                            style={{ flex: 1 }}
                            contentContainerStyle={{ padding: 10 }}
                        />
                    </View>
                </View>}
            </ScrollView>
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
    }
});
export default NewsDetailsScreen;