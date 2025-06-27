import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";

export default function Login() {
  const navigation = useNavigation();

  Font.useFonts({
    "Satoshi-Variable": require("../../assets/fonts/Satoshi-Variable.ttf"),
  });

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: "Satoshi-Variable" };

  const goToPhoneLogin = () => {
    navigation.navigate("TermsAndConditions");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/light-vertical-cavos-logo.png")} // This should be the combined logo+text image
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.taglineText}>Banking without a bank</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={goToPhoneLogin}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 300,
    height: 100,
    marginBottom: 20,
  },
  taglineText: {
    color: "#EAE5DC",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "300",
  },
  button: {
    backgroundColor: "#EAE5DC",
    width: "80%",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "500",
  },
});
