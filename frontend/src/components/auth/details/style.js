import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
        backgroundColor: 'white'
    },
    headerText: {
        fontFamily: 'Colton-Bold',
        fontSize: 25,
        marginBottom: 25,
        color: '#f9d264',
        textAlign: 'center'
    },
    textInput: {
        fontFamily: 'Colton-Black',
        borderColor: 'lightgray',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        paddingVertical: 10,
        // paddingHorizontal: 20,
        marginTop: 20,
    },
    button: {
        marginTop: 80,
        borderColor: 'lightgray',
        // borderWidth: 1,
        borderStyle: 'solid',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#f9d264',
        borderRadius: 40,
    },
    buttonText: {
        fontFamily: 'Colton-Black',
        color: 'white',
        fontSize: 18
    },
    errorText: {
        fontFamily: 'Colton-Black',
        color: 'red',
        marginTop: 20
    },

});

export default styles;