import { View, SafeAreaView, ScrollView, StyleSheet, Image, Pressable, Content, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Appbar, Surface, Text, TextInput, List, HelperText, Provider, Button } from "react-native-paper";
import AppbarHeader from "../../component/Appbar";

const CouponsApplyScreen = ({ navigation, route }) => {
    const routeData = JSON.parse(route.params);
    const g = require("../../Navigation/Style");

    return (
        <SafeAreaView style={g.Container}>
            <AppbarHeader title="" back={false} home={true} navigation={navigation} />
            <ScrollView
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={g.Content} contentContainerStyle={{ flexGrow: 1 }}>
                    <Image alt="image" style={{ width: '40%', height: '20%' }} source={require('./../../assets/coupons.png')} />
                    <Text style={[g.Subtitle, {fontSize: 22}]}>Confirmation coupons code</Text>
                    <Text style={{ textAlign: 'center', paddingHorizontal: 10, fontSize: 30, fontFamily: 'Poppins_700Bold', marginTop: 10, color: 'blue' }}>{routeData.key}</Text>
                    <Button
                        style={[g.Btn, { marginBottom: 100 }]}
                        mode="contained"
                        onPress={() => navigation.navigate('Coupons')}
                    >
                        Envoyer
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CouponsApplyScreen;