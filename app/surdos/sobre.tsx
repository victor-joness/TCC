import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Video } from "expo-av";

export default function AboutScreen() {
  const handleEmailPress = () => {
    Linking.openURL("mailto:contato@exemplo.com");
  };

  const handleInstagramPress = () => {
    Linking.openURL("https://www.instagram.com/exemplo");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sobre o Aplicativo</Text>
        <Text style={styles.description}>
          Nosso aplicativo foi desenvolvido com o objetivo de promover a
          inclusão e facilitar a comunicação entre pessoas surdas e a
          comunidade, proporcionando uma maneira eficiente e acessível para
          interações. Este aplicativo é parte do Trabalho de Conclusão de Curso
          (TCC) de dois alunos, sendo uma solução inovadora que visa quebrar
          barreiras de comunicação e promover a integração social.
        </Text>

        <Text style={styles.subtitle}>Funcionalidades</Text>
        <Text style={{ ...styles.description, textAlign: "left" }}>
          - Crie e edite seu perfil de forma simples e rápida.
          {"\n"}- Solicite palavras para tradução em LIBRAS.
          {"\n"}- Noticias reunidas e atualizadas.
          {"\n"}- Leis reunidas e atualizadas.
          {"\n"}- Explore o glossário e expanda seu conhecimento.
          {"\n"}- EM BREVE - Tema Preto e Branco 🚧🚧
        </Text>

        <Text style={styles.subtitle}>Como Funciona?</Text>
        <Text style={styles.subtitle}>Veja o vídeo de tutorial</Text>
        <View style={styles.videoContainer}>
          <Video
            source={require("../../assets/tutorial/tutorial.mp4")}
            style={styles.video}
            useNativeControls
          />
        </View>

        <Text style={styles.subtitle}>Intérprete</Text>
        <Text style={styles.description}>
          Todos os vídeos são produzidos pelo núcleo formativo de educação
          bilíngue dos sertões de crateús, e a função de "intérprete" será
          limitada a esse grupo. No entanto, se você deseja participar das
          traduções, pode entrar em contato através do e-mail do app solicitando
          a inclusão. O núcleo fará uma chamada para avaliar suas qualificações
          e certificados. Se tudo estiver em ordem, você terá acesso às
          funcionalidades de intérprete.
        </Text>

        <Text style={styles.subtitle}>Privacidade</Text>
        <Text style={{ ...styles.description, textAlign: "left" }}>
          Nossa política de privacidade estabelece como tratamos e protegemos
          suas informações pessoais. Ao usar o aplicativo, você concorda com a
          coleta, uso e compartilhamento de dados conforme descrito abaixo:
          {"\n"}
          {"\n"}
          1. Coletamos informações pessoais necessárias para a operação do app,
          como nome, e-mail e dados de uso.
          {"\n"}
          2. Seus dados serão usados exclusivamente para melhorar sua
          experiência no app e para fins administrativos.
          {"\n"}
          3. Tomamos medidas de segurança para proteger seus dados, mas não
          podemos garantir total segurança contra falhas técnicas.
          {"\n"}
          4. Seus dados pessoais não serão compartilhados com terceiros sem sua
          permissão, exceto quando necessário para cumprimento de obrigações
          legais.
          {"\n"}
          {"\n"}
          Para mais detalhes, leia nossa Política de Privacidade completa.
          [LINK]
        </Text>

        <Text style={styles.subtitle}>Termos de Uso</Text>
        <Text style={{ ...styles.description, textAlign: "left" }}>
          Ao utilizar este aplicativo, você concorda com os seguintes termos de
          uso:
          {"\n"}
          {"\n"}
          1. O uso do app é permitido apenas para fins legais e de acordo com as
          normas do serviço.
          {"\n"}
          2. Você é responsável por todas as informações que compartilhar dentro
          do app e pelo uso do seu perfil.
          {"\n"}
          3. O aplicativo se reserva o direito de modificar ou encerrar os
          serviços a qualquer momento, com ou sem aviso prévio.
          {"\n"}
          4. Não nos responsabilizamos por danos diretos ou indiretos
          resultantes do uso do aplicativo.
          {"\n"}
          5. O descumprimento dos termos pode resultar em restrições ou
          banimento da plataforma.
          {"\n"}
          {"\n"}
          Para mais detalhes, leia os Termos de Uso completo. [LINK]
        </Text>

        <Text style={styles.subtitle}>Confirmação de Aceite</Text>
        <Text style={styles.description}>
          No momento de cadastramento, você confirmou que leu, entendeu e
          concordou com os Termos de Uso e a Política de Privacidade.
        </Text>

        <Text style={styles.subtitle}>Licença</Text>
        <Text style={styles.description}>
          Este aplicativo está sob alicença [NUMERO]. O código fonte, design e
          funcionalidades não podem ser reutilizados, modificados ou
          distribuídos sem a permissão explícita dos donos. Qualquer uso não
          autorizado é proibido.
        </Text>

        <Text style={styles.subtitle}>Links de Lançamentos</Text>
        <Text style={styles.description}>
          - [App na Play Store] - versão
          {"\n"}- [App na Apple Store] - versão
          {"\n"}- [APK do aplicativo] - versão
        </Text>

        <Text style={styles.subtitle}>Autores</Text>
        <Text style={styles.description}>
          - NOME
          {"\n"}- NOME
        </Text>

        <View style={styles.infosContainer}>
          <Text style={styles.contactText}>
            Se você tiver alguma dúvida ou sugestão, entre em contato conosco:
          </Text>
          <View style={styles.contactButtons}>
            <TouchableOpacity
              onPress={handleEmailPress}
              style={styles.contactButton}
            >
              <Text style={styles.contactButtonText}>📧 E-mail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleInstagramPress}
              style={styles.contactButton}
            >
              <Text style={styles.contactButtonText}>📸 Instagram</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>Versão do App</Text>
          <Text style={styles.description}>Versão 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 20,
    color: "#000",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    color: "#555",
    lineHeight: 22,
    textAlign: "center",
  },
  videoContainer: {
    width: "100%",
    height: 540,
    marginTop: 15,
    borderRadius: 10,
    overflow: "hidden",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  infosContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  contactText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  contactButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  contactButton: {
    backgroundColor: "#00b4d8",
    padding: 12,
    borderRadius: 8,
    margin: 5,
    width: 150,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
