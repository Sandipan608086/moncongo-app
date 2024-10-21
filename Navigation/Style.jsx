import { StyleSheet } from 'react-native';
module.exports = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: "rgba(248, 248, 248, 1)",
    },
    Content: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        marginBottom: 30
    },
    Form: {
        width: '100%',
        padding: 15
    },
    Subtitle: {
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'Poppins_700Bold',
        paddingHorizontal: 20
    },
    Btn: {
        backgroundColor: '#0298d3',
        color: '#ffffff',
        borderRadius: 5,
        marginVertical: 20,
        marginBottom: 0,
    },
    BtnClear: {
        borderRadius: 5,
        marginBottom: 100,
        marginVertical: 20
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#0298d3',
        alignItems: 'center',
        // paddingHorizontal: '11%'
    },
    list: {
        alignContent: 'center',
        color: '#ffffff'
    },
    lBtn: {
        color: '#ffffff',
        fontFamily: 'Poppins_700Bold'
    },
    fBtn: {
        marginVertical: 10,
        color: '#0298d3',
        fontFamily: 'Poppins_700Bold',
        // fontSize: 18,
        alignItems: 'flex-end',
    },
    businessDetails: {
        fontFamily: 'Poppins_700Bold', 
        fontSize: 22,
        marginBottom: 10,
        textAlign: 'center'
    }
});