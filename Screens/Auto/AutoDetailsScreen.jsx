import { View, SafeAreaView, ScrollView, StyleSheet, Linking, Alert, RefreshControl, useWindowDimensions, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Card, Text, FAB } from "react-native-paper";
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import Swiper from 'react-native-swiper';
import { useSelector, useDispatch } from "react-redux";
import AppbarHeader from "../../component/Appbar";
import { autoDetailApi } from "../../store/AutoSlices";
import { Location } from "../../Navigation/Icon";
import { mixedStyle } from "./../../Navigation/htmlStyle";
const AutoDetail = ({ navigation, route }) => {
    const systemFonts = [...defaultSystemFonts, 'Poppins_400Regular', 'Poppins_700Bold'];
    const dispatch = useDispatch();
    const routeData = JSON.parse(route.params);
    // const AUTODETAILDATA = useSelector(state => state.auto.autoDetail);
    const [AUTODETAILDATA, setAUTODETAILDATA] = useState("");
    const LODING = useSelector(state => state.auto.loading);
    const [state, setState] = useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    useEffect(() => {
        onRefresh()
        return () => { }
    }, [])
    const onRefresh = () => {
        dispatch(autoDetailApi({ slug: routeData.slug })).then((req) => {
            setAUTODETAILDATA(req.payload.data);
        })
    }

    const DataValue = AUTODETAILDATA ? [
        {
            id: 1,
            icon: 'calendar',
            name: "Année",
            value: AUTODETAILDATA.car_year
        },
        {
            id: 2,
            icon: 'speedometer',
            name: "Kilométrage",
            value: AUTODETAILDATA.car_kilometers
        },
        {
            id: 3,
            icon: 'format-color-fill',
            name: "Couleur",
            value: AUTODETAILDATA.car_color
        },
        {
            id: 4,
            icon: 'car-door',
            name: "Nombre de portes",
            value: `${AUTODETAILDATA.car_doors} Portes`
        },
        {
            id: 5,
            icon: 'car-shift-pattern',
            name: "Boîte de vitesse",
            value: AUTODETAILDATA.car_transmission_type
        },
        {
            id: 6,
            icon: 'tire',
            name: "Roue motrice",
            value: AUTODETAILDATA.car_wheel_drive
        },
        {
            id: 7,
            icon: 'car-defrost-front',
            name: "Climatisation",
            value: AUTODETAILDATA.car_air_conditioner > 0 ? 'Oui' : 'Non'
        },
        {
            id: 8,
            icon: 'steering',
            name: "Volant",
            value: AUTODETAILDATA.car_steering
        },
        {
            id: 9,
            icon: 'fuel',
            name: "Carburant",
            value: AUTODETAILDATA.car_fuel
        },
        {
            id: 10,
            icon: 'alpha-b-circle-outline',
            name: "Marque",
            value: AUTODETAILDATA.brand_title
        }
    ] : []
    const { width } = useWindowDimensions();
    return (
        <SafeAreaView style={styles.container}>
            <AppbarHeader title="Auto" back={true} home={true} navigation={navigation} />
            <ScrollView
                style={styles.ScrollView}
                showsVerticalScrollIndicator={true}
                showsHorizontalScrollIndicator={false}
                horizontal={false}
                refreshControl={<RefreshControl refreshing={LODING} onRefresh={onRefresh} />}
            >
                {AUTODETAILDATA && <View>
                    {
                        AUTODETAILDATA.flier_image &&
                        <Swiper style={styles.wrapper} height={350} showsButtons={true} autoplay>
                            {
                                AUTODETAILDATA.flier_image.map((value, i) => {
                                    return <Card key={i} mode="elevated" style={{ backgroundColor: "#fff", marginBottom: 20, height: 350 }}>
                                        <Card.Cover source={{ uri: value }} style={{ width: '100%', height: '100%' }} />
                                    </Card>
                                })
                            }
                        </Swiper>
                    }
                    {AUTODETAILDATA.car_name && <Text style={[styles.Title, { marginTop: 10 }]}>{AUTODETAILDATA.car_name}</Text>}

                    {AUTODETAILDATA.car_price !== '--' ? <View style={{flexDirection: 'row'}}><Text style={[styles.Title, { marginVertical: 10 }]}>${AUTODETAILDATA.car_price}</Text><Text style={{marginTop: 18}}>{AUTODETAILDATA.car_negotiable == 1 && '/Négotiable'}</Text></View> : <View style={{flexDirection: 'row'}}><Text style={[{ marginVertical: 10 }]}>Contactez le vendeur pour le prix</Text></View>}

                    {AUTODETAILDATA.car_address && <View style={{ paddingVertical: 5, flexDirection: 'row', marginBottom: 10 }}><Location size={24} color='black' /><Text style={{ paddingHorizontal: 11, fontSize: 16 }}>{AUTODETAILDATA.car_address}</Text></View>}

                    <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row' }}>
                        {
                            DataValue &&
                            DataValue.map((data, i) => {
                                return <View style={{ flexBasis: '47%', margin: 5 }} key={i}>
                                    <Card mode="elevated" style={{ backgroundColor: "#ebf8ff", flex: 1 }}>
                                        <Card.Title
                                            title={data.name}
                                            titleStyle={{ textTransform: 'capitalize', fontSize: 14 }}
                                            subtitle={data.value}
                                            subtitleStyle={{ textTransform: 'capitalize', fontFamily: 'Poppins_700Bold', fontSize: 12 }}
                                            left={(props) => <Avatar.Icon style={{ backgroundColor: '#007096' }} {...props} icon={data.icon} />}
                                        />
                                    </Card>
                                </View>
                            })
                        }
                    </View>
                    <View style={{ backgroundColor: '#ebf8ff', marginVertical: 20 }}>
                        {
                            AUTODETAILDATA.car_long_text != '' && (
                                <RenderHtml
                                    contentWidth={width}
                                    source={{ html: AUTODETAILDATA.car_long_text ? AUTODETAILDATA.car_long_text : '' }}
                                    tagsStyles={mixedStyle}
                                    systemFonts={systemFonts}
                                />

                            )
                        }
                    </View>
                </View>}
            </ScrollView>
            <FAB.Group
                open={open}
                visible
                icon={open ? 'close' : 'contacts-outline'}
                backdropColor="rgba(0,0,0,0)"
                color="#ffffff"
                fabStyle={{backgroundColor: '#0298d3'}}
                actions={[
                    {
                        icon: 'phone',
                        label: 'Appel',
                        color: '#ffffff',
                        style: {backgroundColor: '#0298d3'},
                        onPress: () => AUTODETAILDATA.car_mobile ? Linking.openURL(`tel:${AUTODETAILDATA.car_mobile}`) : Alert.alert('Désolé! Aucun numéro de contact trouvé'),
                        labelStyle: styles.fabLabelStyle
                    },
                    {
                        icon: 'whatsapp',
                        label: 'WhatsApp',
                        onPress: () => AUTODETAILDATA.car_whatsapp !== "" ? Linking.openURL(`https://wa.me/${AUTODETAILDATA.car_whatsapp}`) : Alert.alert('Désolé! Aucun contact WhatsApp trouvé'),
                        color: '#ffffff',
                        style: { backgroundColor: '#64B161' },
                        labelStyle: styles.fabLabelStyle
                    },
                ]}
                onStateChange={onStateChange}
                onPress={() => {
                    if (open) {
                        // do something if the speed dial is open
                    }
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
    ScrollView: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 150
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
    fabLabelStyle: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 20
    },
    date: {
        display: 'flex',
        backgroundColor: '#ebf8ff',
        color: '#ffffff',
        padding: 10
    },
    wrapper: {},
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
    Cover: {
        width: '100%',
        height: 100,
        padding: 0,
        borderRadius: 0,
        backgroundColor: '#007096'
    },
    cardText: {
        textAlign: "center",
        paddingTop: 10,
        fontSize: 16,
    },
});
export default AutoDetail;