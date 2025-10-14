import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../utils/constants';

const { width } = Dimensions.get('window');

const ChartComponent = ({ data, type = 'bar' }) => {
  if (type === 'bar') {
    return <BarChart data={data} />;
  }
  return <PieChart data={data} />;
};

const BarChart = ({ data }) => {
  const maxValue = Math.max(...Object.values(data));
  
  return (
    <View style={styles.container}>
      {Object.entries(data).map(([key, value]) => (
        <View key={key} style={styles.barContainer}>
          <Text style={styles.label}>{key}</Text>
          <View style={styles.barBackground}>
            <View 
              style={[
                styles.bar, 
                { 
                  width: `${(value / maxValue) * 100}%`,
                  backgroundColor: getColorForValue(value, maxValue)
                }
              ]} 
            />
          </View>
          <Text style={styles.value}>{Math.round(value)}%</Text>
        </View>
      ))}
    </View>
  );
};

const PieChart = ({ data }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  return (
    <View style={styles.pieContainer}>
      {Object.entries(data).map(([key, value], index) => (
        <View key={key} style={styles.pieItem}>
          <View 
            style={[
              styles.pieColor, 
              { backgroundColor: COLORS[['primary', 'secondary', 'info', 'warning', 'success'][index % 5]] }
            ]} 
          />
          <Text style={styles.pieLabel}>
            {key}: {Math.round((value / total) * 100)}%
          </Text>
        </View>
      ))}
    </View>
  );
};

const getColorForValue = (value, maxValue) => {
  const percentage = (value / maxValue) * 100;
  if (percentage > 75) return COLORS.danger;
  if (percentage > 50) return COLORS.warning;
  if (percentage > 25) return COLORS.info;
  return COLORS.success;
};

const styles = StyleSheet.create({
  container: {
    padding: SIZES.padding,
  },
  barContainer: {
    marginBottom: SIZES.padding,
  },
  label: {
    fontSize: SIZES.font,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  barBackground: {
    height: 30,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius / 2,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: SIZES.radius / 2,
  },
  value: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  pieContainer: {
    padding: SIZES.padding,
  },
  pieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  pieColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: SIZES.base,
  },
  pieLabel: {
    fontSize: SIZES.font,
    color: COLORS.dark,
    textTransform: 'capitalize',
  },
});

export default ChartComponent;
