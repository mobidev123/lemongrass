import React, { Component } from 'react';
import {
    StyleSheet
  } from 'react-native';
import {Block, Text} from 'galio-framework';
import theme from '../constants/theme';

export default class Title extends Component {
    render (){
        return (
            <Block left style={styles.title}>
                <Text h3 style={{fontWeight: '300'}}>{this.props.title}</Text>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
  title: {
    width: '50%',
    marginLeft: '5%',
    marginBottom: 10,
  }
});