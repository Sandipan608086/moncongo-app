import { View, SafeAreaView, ScrollView, StyleSheet, AppState, Alert, Share, RefreshControl, Image, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Text, ToggleButton, IconButton, FAB, Button, List, Modal, Appbar } from "react-native-paper";
import Swiper from 'react-native-swiper';
import { FormBuilder } from 'react-native-paper-form-builder';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from "react-redux";
import AppbarHeader from "../../component/Appbar";
import { couponsDetailApi } from "../../store/CouponsSlices";
import { loginApi, userSetKey } from "../../store/UserSlices";
import RenderHtml from 'react-native-render-html';
import CountDown from 'react-native-countdown-fixed';

const CouponsDetails = ({ navigation, route }) => {
    const g = require("../../Navigation/Style");
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const userKey = useSelector(state => state.user.userKey);
    const routeData = JSON.parse(route.params);
    const COUPONSDATA = useSelector(state => state.coupon.couponsDetail);
    const LODING = useSelector(state => state.coupon.loading);
    const [dateTime, setDateTime] = useState("");
    const { width, height } = useWindowDimensions();
    useEffect(() => {
        onRefresh();

        return () => { }
    }, [])
    const onRefresh = () => {
        dispatch(couponsDetailApi({ slug: routeData.slug })).then((req) => {
            setDateTime(req.payload.coupons_dt)
        })
    }
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: COUPONSDATA.url,
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
    const { control, setFocus, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onChange',
    });
    const couponApply = (e) => {
        if (userKey) {
            navigation.navigate('CouponsOtp', JSON.stringify({ data: e }))
        } else {
            setModalVisible(true)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <AppbarHeader title="Coupon" back={true} home={true} navigation={navigation} />
            <ScrollView
                style={styles.ScrollView}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                horizontal={false}
                refreshControl={
                    <RefreshControl refreshing={LODING} onRefresh={onRefresh} />
                }
            >
                {dateTime && <View style={styles.ScrollView} >
                    <Card>
                        <Card.Title
                            title={COUPONSDATA.coupons_title}
                            subtitle={COUPONSDATA.coupons_prix}
                            titleStyle={{ fontFamily: 'Poppins_700Bold' }}
                            left={() => (
                                <Avatar.Image
                                    size={48}
                                    source={COUPONSDATA.coupons_logo ? { uri: COUPONSDATA.coupons_logo } : require("../../assets/noImage.png")}
                                />
                            )}
                        />
                        <Text style={styles.date}>Valable jusque: {COUPONSDATA.coupons_end_date_new}</Text>
                        <Card.Actions>
                            <Button style={styles.btn} mode="contained" onPress={() => couponApply(COUPONSDATA)}>Appliquer</Button>
                        </Card.Actions>
                    </Card>
                    <CountDown
                        style={{ marginTop: 20 }}
                        until={dateTime}
                        digitStyle={{ backgroundColor: '#0298d3' }}
                        digitTxtStyle={{ color: '#fff' }}
                        onFinish={() => Alert.alert('finished')}
                        size={20}
                    />
                    {
                        COUPONSDATA.coupons_banner_img &&
                        <Swiper style={{ marginTop: 20 }} height={250} showsButtons={true} autoplay>
                            {
                                COUPONSDATA.coupons_banner_img.map((value, i) => {
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
                    {
                        COUPONSDATA.coupons_highlights && (
                            <View>
                                <Text style={{ fontSize: 20, fontFamily: 'Poppins_700Bold', marginTop: 20 }}>Points forts:</Text>
                                <View style={styles.view}>
                                    {
                                        COUPONSDATA.coupons_highlights.map((value, i) => {
                                            return <View key={i}>
                                                <List.Item
                                                    title={value.text}
                                                    left={props => <List.Icon {...props} icon="arrow-right-thin-circle-outline" />}
                                                />
                                            </View>
                                        })
                                    }
                                </View>
                            </View>
                        )
                    }
                    {
                        COUPONSDATA.coupons_description != '' &&
                        <View style={styles.view}>
                            <RenderHtml
                                contentWidth={width}
                                source={{ html: COUPONSDATA.coupons_description ? COUPONSDATA.coupons_description : '' }}
                            />
                        </View>
                    }
                    {
                        COUPONSDATA.coupons_details &&
                        <View>
                            <Text style={{ fontSize: 20, fontFamily: 'Poppins_700Bold', marginTop: 20 }}>En savoir plus:</Text>
                            <View style={styles.view}>
                                {
                                    COUPONSDATA.coupons_details.map((value, i) => {
                                        return <View key={i}>
                                            <List.Item
                                                title={value.text}
                                                left={props => <List.Icon {...props} icon="arrow-right-thin-circle-outline" />}
                                            />
                                        </View>
                                    })
                                }
                            </View>
                        </View>
                    }
                    {
                        COUPONSDATA.coupons_tac != '' &&
                        <View>
                            <Text style={{ fontSize: 20, fontFamily: 'Poppins_700Bold', marginTop: 20 }}>Termes et Conditions:</Text>
                            <View style={styles.view}>
                                <RenderHtml
                                    contentWidth={width}
                                    source={{ html: COUPONSDATA.coupons_tac ? COUPONSDATA.coupons_tac : '' }}
                                />
                            </View>
                        </View>
                    }
                </View>}
            </ScrollView>
            <FAB
                icon="share"
                style={styles.share}
                onPress={() => onShare()}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Appbar.Header style={{ marginTop: -30 }}>
                            <Appbar.Content title="SE CONNECTER" />
                            <Appbar.Action icon="close" onPress={() => setModalVisible(!modalVisible)} />
                        </Appbar.Header>
                        <View style={g.Form}>
                            <FormBuilder
                                control={control}
                                setFocus={setFocus}
                                formConfigArray={[
                                    {
                                        type: 'email',
                                        name: 'email',
                                        rules: {
                                            required: {
                                                value: true,
                                                message: 'Ce champ est obligatoire',
                                            },
                                            pattern: {
                                                value:
                                                    /[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/,
                                                message: 'Ce champ doit être un email valide',
                                            },
                                        },
                                        textInputProps: {
                                            label: 'Email',
                                        },
                                    },
                                    {
                                        type: 'password',
                                        name: 'password',
                                        rules: {
                                            required: {
                                                value: true,
                                                message: 'Ce champ est obligatoire',
                                            },
                                            minLength: {
                                                value: 6,
                                                message: 'Le mot de passe doit contenir au moins 6 caractères',
                                            },
                                            maxLength: {
                                                value: 30,
                                                message: 'Le mot de passe doit contenir entre 6 et 30 caractères',
                                            },
                                        },
                                        textInputProps: {
                                            label: 'Mot de passe',
                                        },
                                    },
                                ]}
                            />
                            <Button
                                style={[g.Btn, { marginBottom: 100 }]}
                                mode="contained"
                                onPress={handleSubmit((values) => {
                                    dispatch(loginApi({ data: values })).then((req) => {
                                        if (req.payload.status === true) {
                                            dispatch(userSetKey(req.payload.authorization)).then(() => {
                                                Alert.alert(req.payload.message);
                                                setModalVisible(!modalVisible)
                                            })
                                        } else {
                                            Alert.alert(req.payload.message);
                                        }
                                    })
                                })}
                            >
                                Envoyer
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
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
        marginBottom: 50
    },
    view: {
        backgroundColor: 'white',
        padding: 10,
        marginTop: 20
    },
    Title: {
        fontSize: 22,
        fontFamily: 'Poppins_700Bold',
        textTransform: 'capitalize'
    },
    btn: {
        display: 'flex',
        backgroundColor: '#0298d3',
        color: '#ffffff',
    },
    CardCover: {
        borderRadius: 0,
        height: 300,
    },
    ToggleButton: {
        backgroundColor: '#fff',
        margin: 0
    },
    share: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        alignItems: 'flex-end'
    },
    date: {
        display: 'flex',
        backgroundColor: '#0298d3',
        color: '#ffffff',
        padding: 10
    },
    Text: {
        fontSize: 16,
        fontFamily: 'Poppins_700Bold'
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 22,
    },
    modalView: {
        // margin: 20,
        backgroundColor: 'white',
        // borderRadius: 0,
        // paddingHorizontal: 20,
        // paddingVertical: 20,
        // alignItems: 'center',
        shadowColor: '#000',
        width: '80%',
        height: 350,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});
export default CouponsDetails;