import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, ScrollView, StyleSheet, Alert, FlatList, RefreshControl, Image, useWindowDimensions, Share, Platform } from "react-native";
import Swiper from 'react-native-swiper';
import { WebView } from 'react-native-webview';

const VideoSwiper = (props) => {
    return (
        <SafeAreaView style={styles.wrapper}>
            {
                props.video ?
                    <WebView
                        source={{ uri: props.video }}
                        originWhitelist={['*']}
                        style={{ height: 210 }}
                    />
                    : props.image && <Swiper style={styles.wrapper} height={250} showsButtons={true} autoplay>
                        {
                            props.image.map((value, i) => {
                                return <View style={styles.slide} key={i} >
                                    <Image
                                        resizeMode="stretch"
                                        style={styles.image}
                                        source={{ uri: value.img }}
                                    />
                                </View>
                            })
                        }
                    </Swiper>
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        flex: 1,
    },
    slide: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    image: {
        display: 'flex',
        width: '100%',
        height: '100%'
    },
});
export default VideoSwiper;