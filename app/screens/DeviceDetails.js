import React from 'react';
import {StyleSheet, ScrollView, Dimensions, Alert} from 'react-native';
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
    subtitle: '15 kWh',
  },
  {
    title: 'Lights',
    subtitle: '5 kWh',
  },
  {
    title: 'Television',
    subtitle: '10 kWh',
  },
];

const statsTitles = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

export default class DeviceDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          timeSlots: [
              {
                  title: "1/01/2019 00:00",
                  selected: false
              },
              {
                title: "1/01/2019 00:15",
                selected: false
            },
            {
                title: "1/01/2019 00:30",
                selected: false
            },
            {
                title: "1/01/2019 00:45",
                selected: false
            },
            {
                title: "1/01/2019 01:00",
                selected: false
            },
            {
                title: "1/01/2019 01:15",
                selected: false
            },
            {
                title: "1/01/2019 01:30",
                selected: false
            },
            {
                title: "1/01/2019 01:45",
                selected: false
            },
            {
                title: "1/01/2019 02:00",
                selected: false
            },{
                title: "1/01/2019 02:15",
                selected: false
            },
            {
                title: "1/01/2019 02:30",
                selected: false
            },
            {
                title: "1/01/2019 02:45",
                selected: false
            },
            {
                title: "1/01/2019 03:00",
                selected: false
            },
            {
                title: "1/01/2019 03:15",
                selected: false
            },
            {
                title: "1/01/2019 03:30",
                selected: false
            },
            {
                title: "1/01/2019 03:45",
                selected: false
            },
            {
                title: "1/01/2019 04:00",
                selected: false
            },
            {
                title: "1/01/2019 04:15",
                selected: false
            }
          ]
        };
      }



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

        <Block flex>
          <Text size={BASE_SIZE * 1.125}>{props.title}</Text>
          <Text size={BASE_SIZE * 0.875} style={{marginTop: 5}} muted>
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
          <Title title="Your Devices" />
        <ScrollView style={{flex: 1}}>

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
