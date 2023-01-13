import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        flex: 1

    },
    containerInput: {
        padding: 10,
        flexDirection: 'row'

    },
    input: {
        fontFamily: 'Colton-Medium',
        backgroundColor: 'lightgrey',
        borderRadius: 4,
        flex: 1,
        marginHorizontal: 10,
        paddingHorizontal: 10
    },
    createAccountButton: {
        flexDirection: 'row',
        backgroundColor: '#f9d264',
        color: 'white',
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    }
})

export default styles