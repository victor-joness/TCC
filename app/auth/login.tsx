import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import { Card } from "~/components/ui/card";
import { P } from "~/components/ui/typography";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { z } from "zod";
import { Url } from "~/Utils/Api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{11,}$/;

const schema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Informe um telefone ou e-mail.")
    .refine(
      (value) => emailRegex.test(value) || phoneRegex.test(value),
      "Insira um e-mail ou telefone válido. O telefone deve conter 11 números."
    ),
  password: z.string().min(7, "A senha deve ter no mínimo 7 caracteres."),
});

export default function Screen() {
  const route = useRoute();
  // @ts-ignore
  const email = route.params?.email || "";

  const [form, setForm] = React.useState({ emailOrPhone: email, password: "" });
  const [errors, setErrors] = React.useState({
    emailOrPhone: "",
    password: "",
  });
  const navigation = useNavigation();

  const handleChange = (field: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  type LoginRequestDTO = {
    email: String;
    password: String;
  };

  const loginRequest = async (data: LoginRequestDTO) => {
    try {
      const result = await axios.post(`${Url}/auth/login`, data);
      let userId = result.data.data.id;
      let token = result.data.data.token;
      let user = {};

      if (result.status == 200) {
        user = await axios.get(`${Url}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await AsyncStorage.setItem("Token", token);

        return user;
      } else {
        console.log("teste", result);
        ToastAndroid.show("Login invalido, tente novamente", 5000);
      }

      return user;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro desconhecido, tente novamente";

      if (errorMessage.includes("User.getVerified()")) {
        //@ts-ignore
        navigation.navigate("auth/code", { email: data.email });
        return;
      } else {
        ToastAndroid.show(errorMessage, ToastAndroid.LONG);
      }
    }
  };

  const handleLogin = async () => {
    try {
      // Validação dos campos
      schema.parse(form);
      setErrors({ emailOrPhone: "", password: "" });

      // Faz login
      const res = await loginRequest({
        email: form.emailOrPhone,
        password: form.password,
      });

      const user = res.data;
      const role = user.role;

      // Navegação conforme o cargo
      if (role === "ADMIN") {
        //@ts-ignore
        navigation.navigate("admin/modulos", { user });
      } else if (role === "INTERPRETE") {
        //@ts-ignore
        navigation.navigate("interpretes/modulos", { user });
      } else if (role === "SURDO") {
        //@ts-ignore
        navigation.navigate("surdos/modulos", { user });
      } else {
        Alert.alert("Erro", "Cargo de usuário desconhecido.");
      }
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationErrors: any = {};
        error.errors.forEach((err: any) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      } else {
        Alert.alert("Erro ao fazer login", "Verifique suas credenciais.");
        console.error("Erro no login:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Card style={[styles.card, { borderRadius: 0 }]}>
        <View style={styles.img}>
          <Image
            source={require("~/assets/images/Login.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.container}>
          <Card style={[styles.card, { borderRadius: 0 }]}>
            <View style={styles.loginSection}>
              <P
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 20,
                  color: "#000",
                }}
              >
                Entre com sua conta
              </P>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>E-mail ou Telefone</Text>
                <View style={styles.inputWrapper}>
                  <Icon
                    name="email-outline"
                    size={20}
                    color="#0B8DCD"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail ou telefone"
                    placeholderTextColor="#999"
                    value={form.emailOrPhone}
                    onChangeText={(value) =>
                      handleChange("emailOrPhone", value)
                    }
                  />
                </View>
                {errors.emailOrPhone && (
                  <Text style={styles.errorText}>{errors.emailOrPhone}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputWrapper}>
                  <Icon
                    name="lock-outline"
                    size={20}
                    color="#0B8DCD"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={form.password}
                    onChangeText={(value) => handleChange("password", value)}
                  />
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <P style={styles.signup}>
                Não possui conta?{" "}
                <Text
                  style={styles.signupLink}
                  onPress={() => navigation.navigate("auth/register" as never)}
                >
                  cadastre-se.
                </Text>
              </P>
            </View>
          </Card>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
  },
  card: {
    flex: 1,
    borderRadius: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  img: {
    width: "100%",
    height: "50%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loginSection: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  errorText: {
    fontSize: 12,
    color: "#E74C3C",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#0B8DCD",
    paddingVertical: 12,
    borderRadius: 8,
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
