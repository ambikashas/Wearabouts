import React from 'react';
import { View, ViewProps } from 'react-native';

export const ThemedView: React.FC<ViewProps> = ({ children, ...props }) => (
  <View {...props}>{children}</View>
);