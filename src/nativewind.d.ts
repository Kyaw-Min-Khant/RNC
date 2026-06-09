/**
 * Type declarations for NativeWind className support.
 * When using NativeWind, these props are supported on core RN components.
 * The import ensures we augment the existing module, not replace it.
 */
import "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface TouchableOpacityProps {
    className?: string;
  }
}
