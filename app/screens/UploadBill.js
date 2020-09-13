import React from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
  Linking
} from 'react-native';
import { connect } from 'react-redux';
import { signUp, googleSignIn, facebookSignIn, AsyncStorage, signOut } from '../actions/auth-actions';
import { Block, Button, Input, Text, Icon } from 'galio-framework';
import theme from '../constants/theme';
import Title from '../components/Title';

const { width } = Dimensions.get('window');

class UploadBill extends React.Component {
  state = {
    user: {},
  };

  render() {
    const { user } = this.props
    console.log('----user----', user);

    return (
      <View style={[styles.flex, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={[styles.flex, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: 20 }}>
            Please upload your electricity bill.  You can upload your electricity bill using this URL:
                     </Text>
          <TouchableOpacity
            style={{ height: 40, justifyContent: 'center' }}
            onPress={() => Linking.openURL(`http://34.227.18.102:3000/csv?user_id=${user.id}`)}>
            <Text style={{ fontSize: 20, color: 'gray' }}>
              {'Upload csv file'}</Text>
          </TouchableOpacity>
        </View>
        <Button
          color={theme.COLORS.PRIMARY}
          shadowColor={theme.COLORS.PRIMARY}
          round
          style={{ margin: 10, }}
          onPress={() => this.props.signOut()}>
          Sign Out
          </Button>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signOut: () => dispatch(signOut()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UploadBill);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.WHITE,
    paddingTop: 15,
  },
  flex: {
    flex: 1,
  },
});
