import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleSelect = (role: 'student' | 'driver') => {
    router.push({ pathname: '/login', params: { role } });
  };

  return (
    <View style={styles.container}>
      
      <Image source={require('../assets/images/bora-uni-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Bem-vindo ao BoraUni</Text>
      <Text style={styles.subtitle}>Escolha como deseja entrar:</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect('student')}>
        <Text style={styles.buttonText}>Entrar como Estudante</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleSelect('driver')}>
        <Text style={styles.buttonText}>Entrar como Motorista</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#555',
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});