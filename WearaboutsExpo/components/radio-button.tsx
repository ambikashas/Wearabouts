import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';


const RadioButton = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity style={radioStyles.container} onPress={onPress}>
        <View style={[radioStyles.outerCircle, selected && radioStyles.outerCircleSelected]}>
            {selected && <View style={radioStyles.innerCircle} />}
        </View>
        <ThemedText style={radioStyles.label}>{label}</ThemedText>
    </TouchableOpacity>
);

const radioStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    outerCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#777',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    outerCircleSelected: {
        borderColor: '#0a7ea4',
    },
    innerCircle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#0a7ea4',
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
});

export default RadioButton;