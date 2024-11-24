import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  useWindowDimensions,
} from "react-native";
import { Appbar, Avatar, Button, Card, Surface } from "react-native-paper";
import Swiper from 'react-native-swiper'
import { Address, Phone, Email, Website, Share, Location } from "../Navigation/Icon";

const BusinessHomeTabCom = (props) => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.ScrollView}>
                <Swiper style={styles.wrapper} height={250} showsButtons={true} autoplay>
                    <View style={styles.slide1}>
                        <Image alt="image"
                            resizeMode="stretch"
                            style={styles.image}
                            source={require('./../assets/banner01.png')}
                        />
                    </View>
                    <View style={styles.slide2}>
                        <Image alt="image"
                            resizeMode="stretch"
                            style={styles.image}
                            source={require('./../assets/banner01.png')}
                        />
                    </View>
                    <View style={styles.slide3}>
                        <Image alt="image"
                            resizeMode="stretch"
                            style={styles.image}
                            source={require('./../assets/banner01.png')}
                        />
                    </View>
                </Swiper>
                <View style={styles.info}>
                    <View style={{paddingVertical: 5, flexDirection: 'row'}}><Location size={24} color='white' /><Text style={styles.text}>Avenue de la Mission / Gombe, Kinshasa</Text></View>
                    <View style={{paddingVertical: 5, flexDirection: 'row'}}><Phone size={21} color='white' /><Text style={styles.text}>(+243)844 427 118</Text></View>
                    <View style={{paddingVertical: 5, flexDirection: 'row'}}><Email size={21} color='white' /><Text style={styles.text}>jefferytravels@gmail.com</Text></View>
                    <View style={{paddingVertical: 5, flexDirection: 'row'}}><Website size={21} color='white' /><Text style={styles.text}>www.jefferytravels.com</Text></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ScrollView: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(248, 248, 248, 1)",
  },
  wrapper: {},
  slide1: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  info: {
    flex: 1,
    backgroundColor: '#0298d3',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 10
  },
  text: {
    paddingHorizontal: 11,
    color: 'white'
  }
});

export default BusinessHomeTabCom;
