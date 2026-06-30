import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { Radius, Shadow, Typography } from '../theme/themes';

// Íconos por nombre de ruta/label — sin emojis
const ICONS: Record<string, { active: any; inactive: any; label: string }> = {
  Inicio:        { active: 'home',           inactive: 'home-outline',          label: 'Inicio' },
  Menu:          { active: 'restaurant',     inactive: 'restaurant-outline',    label: 'Menú' },
  Pedidos:       { active: 'receipt',        inactive: 'receipt-outline',       label: 'Pedidos' },
  Cuenta:        { active: 'person',         inactive: 'person-outline',        label: 'Cuenta' },
  'Mis pedidos': { active: 'bag',            inactive: 'bag-outline',           label: 'Mis pedidos' },
  'Mi cuenta':   { active: 'person-circle', inactive: 'person-circle-outline', label: 'Mi cuenta' },
  MiCuenta:      { active: 'person-circle', inactive: 'person-circle-outline', label: 'Mi cuenta' },
};

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.tab.bg,
        borderTopColor: theme.tab.border,
        paddingBottom: Math.max(insets.bottom, 8),
      },
      Shadow.card,
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = typeof options.tabBarLabel === 'string'
          ? options.tabBarLabel
          : route.name;

        const isFocused = state.index === index;
        const iconSet = ICONS[label] ?? ICONS[route.name] ?? {
          active: 'ellipse', inactive: 'ellipse-outline', label,
        };

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tab}
          >
            {/* Indicador superior */}
            {isFocused && (
              <View style={[styles.indicator, { backgroundColor: theme.tab.indicator }]} />
            )}

            {/* Ícono con fondo al seleccionar */}
            <View style={[
              styles.iconWrap,
              isFocused && { backgroundColor: theme.accent.subtle },
            ]}>
              <Ionicons
                name={isFocused ? iconSet.active : iconSet.inactive}
                size={20}
                color={isFocused ? theme.tab.active : theme.tab.inactive}
              />
            </View>

            {/* Label */}
            <Text style={[
              styles.label,
              { color: isFocused ? theme.tab.active : theme.tab.inactive },
              isFocused && { fontWeight: '700' },
            ]}>
              {iconSet.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    gap: 3,
  },
  indicator: {
    position: 'absolute',
    top: -10,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  iconWrap: {
    width: 42,
    height: 34,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...Typography.micro,
    letterSpacing: 0.2,
  },
});

export default TabBar;