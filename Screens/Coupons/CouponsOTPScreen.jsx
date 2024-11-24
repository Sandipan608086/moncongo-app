import { View, SafeAreaView, ScrollView, StyleSheet, Image, Pressable, Content, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Appbar, Surface, Text, TextInput, List, HelperText, Provider, Button } from "react-native-paper";
import OTPTextView from 'react-native-otp-textinput';
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import { couponsOtpApi } from "../../store/CouponsSlices";

const CouponsOtpScreen = ({ navigation, route }) => {
    const g = require("../../Navigation/Style");
    const dispatch = useDispatch();
    const routeData = JSON.parse(route.params)
    const [otpInput, setOtpInput] = useState("");
    const input = useRef(null);
    const clear = () => input.current.clear();
    const counting = (number) => {
        let count = 0;
        for (let n = number; n > 0; n = Math.floor(n / 10)) {
            count++;
        }
        return count;
    }
    const showTextAlert = () => {
        if (counting(otpInput) === 4) {
            dispatch(couponsOtpApi({ otp: otpInput, id: routeData.data.coupons_id })).then((req) => {
                if (req.payload.status === true) {
                    navigation.navigate('CouponsApply', JSON.stringify({ key: req.payload.key }))
                    Alert.alert(req.payload.message);
                } else {
                    Alert.alert(req.payload.message);
                }
            })
        } else {
            Alert.alert('OTP has been incomplete')
        }
    };
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
                    <Image alt="image" style={g.logo} source={require('./../../assets/logo.png')} />
                    <Text style={g.Subtitle}>Enter Marchant Code</Text>
                    <View style={[g.Form, { paddingHorizontal: 50 }]}>
                        <OTPTextView
                            ref={input}
                            handleTextChange={setOtpInput}
                            inputCount={4}
                            keyboardType="numeric"
                        />
                        <Button style={g.Btn} mode="contained" onPress={showTextAlert}> Envoyer </Button>
                        <Button style={g.BtnClear} mode="outlined" onPress={clear}> clear </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default CouponsOtpScreen;