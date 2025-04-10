declare module 'react-native' {
  import * as React from 'react';
  
  export interface ViewProps {
    style?: any;
    children?: React.ReactNode;
  }
  
  export interface TextProps {
    style?: any;
    children?: React.ReactNode;
  }
  
  export interface ImageProps {
    source: { uri: string } | number;
    style?: any;
  }
  
  export const View: React.FC<ViewProps>;
  export const Text: React.FC<TextProps>;
  export const Image: React.FC<ImageProps>;
  export const StyleSheet: any;
  export const FlatList: React.FC<any>;
  export const ScrollView: React.FC<any>;
  export const TextInput: React.FC<any>;
  export const TouchableOpacity: React.FC<any>;
  export const ActivityIndicator: React.FC<any>;
} 