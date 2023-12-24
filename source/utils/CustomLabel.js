import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../common';

const AnimatedView = Animated.createAnimatedComponent(View);

/**custom label default props */
CustomLabel.defaultProps = {
    leftDiff: 0,
};

const width = 50;
const pointerWidth = width * 0.47;

/**custom label method */
function LabelBase(props) {
    const { position, value, leftDiff, pressed } = props;
    const scaleValue = React.useRef(new Animated.Value(0.1)); // Behaves oddly if set to 0
    const cachedPressed = React.useRef(pressed);
    React.useEffect(() => {
        Animated.spring(scaleValue.current, {
            toValue: 1,
            duration: 200,
            delay: pressed ? 0 : 2000,
            useNativeDriver: false,
        }).start();
        cachedPressed.current = pressed;
    }, [pressed]);
    return (
        Number.isFinite(position) &&
        Number.isFinite(value) && (
            <AnimatedView
                style={[
                    styles.sliderLabel,
                    {
                        left: position - width / 2,
                        transform: [
                            { translateY: width },
                            { scale: scaleValue.current },
                            { translateY: -width },
                        ],
                    },
                ]}
            >
                <View style={styles.pointer} />
                <Text style={styles.sliderLabelText}>{value}</Text>
            </AnimatedView>
        )
    );
}

/**
 * 
 * @param {*} props 
 * Custom Component for label which shows above Slider in filter module
 */
export default function CustomLabel(props) {
    const {
        leftDiff,
        oneMarkerValue,
        twoMarkerValue,
        oneMarkerLeftPosition,
        twoMarkerLeftPosition,
        oneMarkerPressed,
        twoMarkerPressed,
    } = props;

    return (
        <View style={styles.parentView}>
            <LabelBase
                position={oneMarkerLeftPosition}
                value={oneMarkerValue}
                leftDiff={leftDiff}
                pressed={oneMarkerPressed}
            />
            <LabelBase
                position={twoMarkerLeftPosition}
                value={twoMarkerValue}
                leftDiff={leftDiff}
                pressed={twoMarkerPressed}
            />
        </View>
    );
}

/**component styling */
const styles = StyleSheet.create({
    parentView: {
        position: 'relative',
    },
    sliderLabel: {
        position: 'absolute',
        justifyContent: 'center',
        bottom: '100%',
        width: width,
        height: width,
    },
    sliderLabelText: {
        textAlign: 'center',
        top: 40,
        flex: 1,
        fontSize: 18,
        color: colors.blueShade1,
    },
    pointer: {
    },
});