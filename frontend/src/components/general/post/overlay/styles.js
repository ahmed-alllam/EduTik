import { Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        position: 'absolute',
        zIndex: 999,
        bottom: 0,
        paddingLeft: 20,
        paddingBottom: 40,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    displayName: {
        color: 'white',
        // fontWeight: 'bold',
        fontFamily: 'Colton-Bold',
        fontSize: 16
    },
    description: {
        marginTop: 10,
        color: 'white',
        fontFamily: 'Colton-Medium',
        maxHeight: 50,
        // width: '800',
        // textAlign: 'right'
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 30
    },
    leftContainer: {
        alignItems: 'center'
    },
    actionButton: {
        paddingBottom: 16
    },
    actionButtonText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 4
    }
})

export default styles