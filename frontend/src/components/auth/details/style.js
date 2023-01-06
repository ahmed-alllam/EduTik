import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 25,
        color: 'darkslategray',
        textAlign: 'center'
    },
    textInput: {
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
        borderWidth: 1,
        borderStyle: 'solid',
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: 'red'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    errorText: {
        color: 'red',
        marginTop: 20
    },

});

export default styles;