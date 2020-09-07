import React from 'react';
import {StyleSheet, ScrollView, Dimensions, Alert} from 'react-native';
import {Defs, LinearGradient, Stop} from 'react-native-svg';
import {AreaChart} from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import {LineChart} from 'react-native-chart-kit';
import {FAB} from 'react-native-paper';
import {Button, Block, Icon, Text} from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';

const BASE_SIZE = theme.SIZES.BASE;
const COLOR_WHITE = theme.COLORS.WHITE;
const COLOR_GREY = theme.COLORS.MUTED; // '#D8DDE1';

// mock data
const cards = [
  {
    title: 'Dryer',
    subtitle: '15 kWh this week',
    icon: 'tumble-dryer',
  },
  {
    title: 'Lights',
    subtitle: '5 kWh this week',
    icon: 'lightbulb-on-outline',
  },
  {
    title: 'Television',
    subtitle: '10 kWh this week',
    icon: 'television'
  },
];
const statsTitles = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

export default class Home extends React.Component {

  renderStatsSVG = () => {
    const GradientStats = () => (
      <Defs key="gradient">
        <LinearGradient id="gradient" x1="0" y="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={theme.COLORS.THEME} />
          <Stop offset="100%" stopColor={theme.COLORS.INFO} />
        </LinearGradient>
      </Defs>
    );

    const statsActive = Array.from({length: 20}, () =>
      parseFloat((Math.random() * 0.8 + 1).toFixed(3)),
    );
    const statsInactive = Array.from({length: 12}, () =>
      parseFloat((Math.random() * 0.7 + 1).toFixed(3)),
    );

    return (
      <Block style={{marginBottom: BASE_SIZE * 3}}>
        <Title title="Home"></Title>
        <Text center h5 color={COLOR_GREY}> React Native SVG Chart</Text>
        <AreaChart
          yMin={0}
          yMax={Math.max(...statsActive) + 1}
          data={statsInactive}
          curve={shape.curveNatural}
          style={[StyleSheet.absoluteFill]}
          contentInset={{
            bottom: -BASE_SIZE * 0.15,
            right: -BASE_SIZE * 0.15,
            left: -BASE_SIZE * 0.15,
          }}
          svg={{strokeWidth: 1, stroke: 'rgba(0,0,0,0.2)', strokeDasharray: 4}}>
          <GradientStats />
        </AreaChart>
        <AreaChart
          yMin={0}
          yMax={Math.max(...statsActive) + 1}
          data={statsActive}
          curve={shape.curveNatural}
          style={{height: BASE_SIZE * 10}}
          contentInset={{
            bottom: -BASE_SIZE * 0.21,
            right: -BASE_SIZE * 0.21,
            left: -BASE_SIZE * 0.21,
          }}
          svg={{strokeWidth: BASE_SIZE * 0.1875, stroke: 'url(#gradient)'}}>
          <GradientStats />
        </AreaChart>
        <Block row space="evenly" style={{marginTop: BASE_SIZE}}>
          {statsTitles.map(title => (
            <Text key={title} size={theme.SIZES.FONT * 0.85} muted>
              {title}
            </Text>
          ))}
        </Block>
      </Block>
    );
  };

  renderStatsChart = () => {
    return (
      <Block center>
        <Text h5 color={COLOR_GREY}> React Native Chart Kit</Text>
        <LineChart
          data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                ],
              },
            ],
          }}
          width={Dimensions.get('window').width} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: theme.COLORS.NEUTRAL,
            backgroundGradientFrom: theme.COLORS.NEUTRAL,
            backgroundGradientFromOpacity: 0.0,
            backgroundGradientTo: theme.COLORS.NEUTRAL,
            backgroundGradientToOpacity: 0.0,
            fillShadowGradient: theme.COLORS.PRIMARY,
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, 0)`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, 0.5)`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5',
              strokeWidth: '1',
              stroke: theme.COLORS.PRIMARY,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </Block>
    );
  };

  renderCard = (props, index) => {
    return (
      <Block
        row
        center
        card
        shadow
        space="between"
        style={styles.card}
        key={props.title}>

        <FAB
          style={styles.fab}
          small
          icon={props.icon}
          color={theme.COLORS.WHITE}
        />

        <Block flex>
          <Text size={BASE_SIZE * 1.125}>{props.title}</Text>
          <Text size={BASE_SIZE * 0.875} muted>
            {props.subtitle}
          </Text>
        </Block>
        <Button shadowless style={styles.right} onPress={() => Alert.alert('WHERE IS THE DATA!')}>
          <Icon
            size={BASE_SIZE * 1.5}
            name="arrow-right"
            family="simple-line-icon"
            color={COLOR_GREY}
          />
        </Button>
      </Block>
    );
  };

  renderCards = () => cards.map((card, index) => this.renderCard(card, index));
  
  render() {
    return (
      <Block safe flex>
        <ScrollView style={{flex: 1}}>
          {/* stats */}
          {this.renderStatsSVG()}

          {/* stats */}
          {this.renderStatsChart()}

          {/* cards */}
          {this.renderCards()}
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderColor: 'transparent',
    marginHorizontal: BASE_SIZE,
    marginVertical: BASE_SIZE / 2,
    padding: BASE_SIZE,
    backgroundColor: COLOR_WHITE,
    shadowOpacity: 0.4,
  },
  menu: {
    width: BASE_SIZE * 2,
    borderColor: 'transparent',
  },
  settings: {
    width: BASE_SIZE * 2,
    borderColor: 'transparent',
  },
  left: {
    marginRight: BASE_SIZE,
  },
  right: {
    width: BASE_SIZE * 2,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  fab: {
    backgroundColor: theme.COLORS.PRIMARY,
    margin: 10,
    right: 5,
  },
});
