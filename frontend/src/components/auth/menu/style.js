import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    containerMain: {
        padding: 30,
        flex: 1,
    },
    headerText: {
        fontFamily: 'Colton-Black',
        fontSize: 25,
        marginBottom: 25,
        color: 'darkslategray',
        textAlign: 'center'
    },
    providerButton: {
        borderColor: 'lightgray',
        borderWidth: 1,
        borderStyle: 'solid',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    providerButtonText: {
        paddingRight: 20,
        fontFamily: 'Colton-Black',

    },

    containerBottomButton: {

        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'lightgray'
    },
    bottomButtonText: {
        fontFamily: 'Colton-Black',
        // fontWeight: 'bold',
        color: '#f9d264'
    }
});

export default styles;