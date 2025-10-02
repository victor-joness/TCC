import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { Url } from "~/Utils/Api";

const CodeScreen = () => {
  const [code, setCode] = useState("");
  const route = useRoute<{ params: { email: string } }>();
  const email = route.params?.email;

  type verificationCodeDTO = {
    email: String;
    code: String;
  };

  const Navigation = useNavigation();

  const verificationCode = async (data: verificationCodeDTO) => {
    try {
      const result = await axios.post(
        `${Url}/auth/validation-email-signup`,
        data
      );

      if (result.status == 200) {
        //@ts-ignore
        Navigation.navigate("auth/login", { email: email });
        ToastAndroid.show("Usuário autenticado com sucesso", 8000);
      } else {
        ToastAndroid.show("Código inválido, tente novamente", 8000);
        setCode("");
      }
    } catch (error) {
      ToastAndroid.show("Opss..., ocorreu algum erro, tente novamente", 8000);
    }
  };

  const handleVerifyCode = () => {
    if (code.length === 6) {
      verificationCode({ email: email, code: code });
    } else {
      alert("Por favor, insira um código de 6 dígitos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro Criado com Sucesso!</Text>
      <Text style={styles.message}>
        Verifique seu e-mail ou celular e insira o código de 6 dígitos.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Código de 6 dígitos"
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
        <Text style={styles.buttonText}>Verificar Código</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#0B8DCD",
    width: "80%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signup: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  signupLink: {
    color: "#0B8DCD",
    fontWeight: "bold",
  },
});

export default CodeScreen;
