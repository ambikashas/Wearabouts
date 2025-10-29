import React from 'react';
import { Text, TextProps } from 'react-native';

export const ThemedText: React.FC<TextProps & { type?: string }> = ({ children, ...props }) => (
  <Text {...props}>{children}</Text>
);