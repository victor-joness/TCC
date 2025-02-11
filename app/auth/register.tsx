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
import { Checkbox } from "~/components/ui/checkbox";
import { P } from "~/components/ui/typography";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { z } from "zod";
import { useNavigation } from "@react-navigation/native";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{11,}$/;

const schema = z.object({
  name: z.string().min(3, "Seu apelido deve ter pelo menos 3 caracteres"),
  emailOrPhone: z
    .string()
    .min(1, "Informe um telefone ou e-mail.")
    .refine(
      (value) => emailRegex.test(value) || phoneRegex.test(value),
      "Insira um e-mail ou telefone válido. O telefone deve conter 11 números."
    ),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
  confirmPassword: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres."),
  role: z.string(),
});

export default function RegisterScreen() {
  const navigation = useNavigation();

  const [form, setForm] = React.useState({
    name: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = React.useState({
    name: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleRegister = () => {
    try {
      schema.parse(form);

      setErrors({
        name: "",
        emailOrPhone: "",
        password: "",
        confirmPassword: "",
        role: "",
      });

      if (form.password !== form.confirmPassword) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "As senhas devem ser iguais",
        }));
        return;
      }

      if (form.role !== "Surdo" && form.role !== "Interprete") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          role: "Selecione uma opção",
        }));
        return;
      }

      console.log("Cadastro realizado com sucesso:", form);
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
        <View style={styles.registerSection}>
          <P style={styles.title}>Crie sua conta</P>

          <P style={styles.signup}>
            Já possui conta?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate("auth/login" as never)}
            >
              Login.
            </Text>
          </P>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="account-outline"
                size={20}
                color="#0B8DCD"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#999"
                value={form.name}
                onChangeText={(value) => handleChange("name", value)}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

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
                placeholder="Digite seu e-mail ou um telefone"
                placeholderTextColor="#999"
                value={form.emailOrPhone}
                onChangeText={(value) => handleChange("emailOrPhone", value)}
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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirme a Senha</Text>
            <View style={styles.inputWrapper}>
              <Icon name="key" size={20} color="#0B8DCD" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Confirme sua senha"
                placeholderTextColor="#999"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(value) => handleChange("confirmPassword", value)}
              />
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/* <View style={styles.roleContainer}>
            <Text style={styles.label}>Escolha uma das opções:</Text>
            <View style={styles.roles}>
              <TouchableOpacity
                style={[
                  styles.roleBox,
                  { backgroundColor: "#0B8DCD" },
                  form.role === "Surdo" && styles.roleBoxSelected,
                ]}
                onPress={() => handleChange("role", "Surdo")}
              >
                <View style={styles.img}>
                  <Image
                    source={require("~/assets/images/surdo_register.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.roleText}>Sou surdo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleBox,
                  { backgroundColor: "#49DA80" },
                  form.role === "Interprete" && styles.roleBoxSelected,
                ]}
                onPress={() => handleChange("role", "Interprete")}
              >
                <View style={styles.img}>
                  <Image
                    source={require("~/assets/images/interprete_register.png")}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.roleText}>Sou Intérprete</Text>
              </TouchableOpacity>
            </View>
            {errors.role && (
              <Text style={styles.errorTextRole}>{errors.role}</Text>
            )}
          </View> */}

          <View style={styles.checkboxContainer}>
            <Checkbox
              onCheckedChange={setAcceptedTerms}
              checked={acceptedTerms}
              style={styles.checkbox}
            />
            <Text style={styles.termsText}>
              Eu aceito os <Text style={styles.linkText}>termos de uso</Text>.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, { opacity: acceptedTerms ? 1 : 0.5 }]}
            onPress={handleRegister}
            disabled={!acceptedTerms}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
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
  registerSection: {
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
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "#000",
    marginBottom: 20,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  input: {
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  errorText: {
    fontSize: 12,
    color: "#E74C3C",
    marginTop: 5,
  },
  errorTextRole: {
    fontSize: 16,
    color: "#E74C3C",
    marginTop: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  roleContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  roleButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999",
    alignItems: "center",
  },
  roleSelected: {
    backgroundColor: "#0B8DCD",
    borderColor: "#0B8DCD",
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  roleBox: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    width: 130,
    height: 130,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  backToLogin: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    marginTop: 10,
  },
  backToLoginLink: {
    color: "#0B8DCD",
    fontWeight: "bold",
  },
  roles: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleBoxSelected: {
    borderColor: "red",
    borderWidth: 2,
  },
  roleText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  iconContainer: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 50,
    marginBottom: 8,
  },
  icon: {
    fontSize: 30,
    color: "#007BFF",
  },
  image: {
    width: "100%",
    height: "100%",
    marginTop: 20,
  },
  img: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkbox: {
    marginRight: 10,
    color: "#000",
    borderColor: "#000",
  },
  termsText: {
    fontSize: 14,
    color: "#333",
  },
  linkText: {
    color: "#0B8DCD",
    fontWeight: "bold",
  },
});
