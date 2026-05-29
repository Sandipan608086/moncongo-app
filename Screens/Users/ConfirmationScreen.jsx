import { View, SafeAreaView, ScrollView, StyleSheet, Image, Pressable, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Appbar, Surface, Text, TextInput, List, HelperText, Provider, Button } from "react-native-paper";
import AppbarHeader from "../../component/Appbar";

const ConfirmationScreen = ({ navigation }) => {
    const g = require("../../Navigation/Style");

    return (
        <SafeAreaView style={g.Container}>
            <AppbarHeader title="" back={true} home={true} navigation={navigation} />
            <ScrollView
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={g.Content} contentContainerStyle={{ flexGrow: 1 }}>
                    <Image alt="image" style={{width: '35%', height: '20%'}} source={require('./../../assets/emailImg.png')} />
                    <Text style={g.Subtitle}>Email confirmation</Text>
                    <Text style={{textAlign: 'center', paddingHorizontal: 10}}>Thanks. You can now log in with your email and chosen password</Text>
                    <Button
                        style={[g.Btn, { marginBottom: 100 }]}
                        mode="contained"
                        onPress={() => navigation.navigate('Login')}
                    >
                        Continue
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ConfirmationScreen;