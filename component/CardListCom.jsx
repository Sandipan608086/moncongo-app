import React, { useEffect, useState, useRef } from "react";
import { View, SafeAreaView, StyleSheet, Pressable } from "react-native";
import { Card, Text } from "react-native-paper";
const CardListCom = (props) => {
    return (
        <Pressable style={styles.card} onPress={() => { props.navigation.replace(props.slug, JSON.stringify({slug: props.item.data_slug}))}}>
            <Card mode="elevated" style={{ backgroundColor: "#fff" }}>
                <Card.Cover
                    source={props.item.data_list_img !== null ? { uri: props.item.data_list_img } : require('../assets/noImage.png')}
                    style={styles.Cover}
                />
                {/* <Card.Content> */}
                    <Text variant="titleLarge" style={styles.cardText}>
                        {props.item.data_title}
                    </Text>
                {/* </Card.Content> */}
            </Card>
        </Pressable>
    )
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: "rgba(248, 248, 248, 1)",
        width: 230, 
        paddingRight: 15,
        marginBottom: 20,
        fontFamily: 'Poppins_400Regular'
    },
    Cover: {
        width: '100%',
        height: 169,
    },
    cardText: {
        width: '100%',
        textAlign: "center",
        padding: 10,
        fontSize: 12,
        fontFamily: 'Poppins_700Bold',
        position: 'absolute',
        bottom: 0,
        backgroundColor: "rgba(255,255,255,.8)",
        lineHeight: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
});
export default CardListCom;