import { StyleSheet, Text } from 'react-native';

import { Container } from '@common/layout';

export default function Settings() {
  return (
    <Container>
      <Text style={styles.text}>Settings</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#808080',
    fontSize: 48,
    textAlign: 'center',
  },
});
