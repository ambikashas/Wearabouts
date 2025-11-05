import React from 'react';
import { View as RNView, Text as RNText } from 'react-native';

export const View: React.FC<any> = (props) => <RNView {...props} />;
export const Text: React.FC<any> = (props) => <RNText {...props} />;
export const Image: React.FC<any> = (props) => <RNText accessibilityRole="image" {...props} />;
