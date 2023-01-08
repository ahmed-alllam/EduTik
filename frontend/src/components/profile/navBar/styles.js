import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: 'lightgray'
    },
    text: {
        fontSize: 16,
        color: 'black',
        flex: 1,
        textAlign: 'center',
        fontFamily: 'Colton-Bold',
        // fontWeight: 'bold'
    }
});

export default styles;