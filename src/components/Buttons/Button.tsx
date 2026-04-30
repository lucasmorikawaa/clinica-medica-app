import React from "react"
import { TouchableHighlight, View, Text } from "react-native"

type Button = {
    title?: string;
    onPress?: () => void;
}

export default function Button({title, onPress}: Button) {
    return(
        <View>
            <TouchableHighlight
                onPress={onPress}
            >
                {title && <Text>{title}</Text>}
            </TouchableHighlight>
        </View>
    )
}