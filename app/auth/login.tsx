import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Card } from "~/components/ui/card";
import { P } from "~/components/ui/typography";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(5, "A senha deve ter no mínimo 5 caracteres."),
});

export default function Screen() {
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState({ email: "", password: "" });
  const navigation = useNavigation();

  const handleChange = (field: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleLogin = () => {
    try {
      schema.parse(form);
      setErrors({ email: "", password: "" });
      console.log("Login com sucesso:", form);

      if(form.email === "admin@gmail.com" && form.password === "admin") {
        navigation.navigate("admin/modulos" as never)
      }

      if(form.email === "surdo@gmail.com" && form.password === "surdo") {
        navigation.navigate("surdos/modulos" as never)
      }

      if(form.email === "interprete@gmail.com" && form.password === "interprete") {
        navigation.navigate("interpretes/modulos" as never)
      }
    } catch (e: any) {
      const validationErrors: any = {};
      e.errors.forEach((error: any) => {
        validationErrors[error.path[0]] = error.message;
      });
      setErrors(validationErrors);
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
                Logue com sua conta
              </P>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>E-mail</Text>
                <View style={styles.inputWrapper}>
                  <Icon
                    name="email-outline"
                    size={20}
                    color="#0B8DCD"
                    style={styles.icon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="#999"
                    value={form.email}
                    onChangeText={(value) => handleChange("email", value)}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
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
    padding: 30
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
