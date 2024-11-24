import { View, SafeAreaView, ScrollView, StyleSheet, Image, Pressable, Content, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Appbar, Surface, Text, TextInput, List, HelperText, Provider, Button } from "react-native-paper";
import OTPTextView from 'react-native-otp-textinput';
import AppbarHeader from "../../component/Appbar";
import { useSelector, useDispatch } from "react-redux";
import { otpApi } from "../../store/UserSlices";

const OtpScreen = ({ navigation, route }) => {
    const g = require("../../Navigation/Style");
    const dispatch = useDispatch();
    const [isloading, setLoading] = useState(false);
    const routeData = JSON.parse(route.params);
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
        if (counting(otpInput) === 6) {
            setLoading(true)
            dispatch(otpApi(JSON.stringify({ otp: otpInput, email: routeData.email }))).then((req) => {
                if (req.payload.sendEmail === true) {
                    navigation.navigate('Login');
                    Alert.alert(req.payload.message);
                    setLoading(false)
                } else if (req.payload.status === false) {
                    Alert.alert(req.payload.message);
                    setLoading(false)
                } else {
                    Alert.alert(req.payload.message);
                    setLoading(false)
                }
            })
        } else {
            Alert.alert('OTP a été incomplet')
        }
    };
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
                    <Image alt="image" style={g.logo} source={require('./../../assets/logo.png')} />
                    <Text style={g.Subtitle}>Entrez OTP</Text>
                    <Text>Votre code unique a été envoyé sur l'adresse email que vous aviez insérez lors de l'inscription</Text>
                    <View style={g.Form}>
                        <OTPTextView
                            ref={input}
                            handleTextChange={setOtpInput}
                            inputCount={6}
                            keyboardType="numeric"
                        />
                        <Button 
                            style={g.Btn} 
                            mode="contained" 
                            onPress={showTextAlert}
                            disabled={isloading}
                            loading={isloading}
                        > 
                            Envoyer 
                        </Button>
                        <Button style={g.BtnClear} mode="outlined" onPress={clear}> Éffacer </Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default OtpScreen;