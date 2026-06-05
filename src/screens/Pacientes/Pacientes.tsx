import React, { useState, useCallback } from "react";

import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";

import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import { db } from "../../config/Firebase";

import { Card } from "../../components/Cards/Card";
import { Input } from "../../components/Inputs/Input";

import { styles } from "./PacientesStyles";

type Paciente = {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  convenio: string;
};

export default function Pacientes() {
  const navigation = useNavigation<any>();

  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const [busca, setBusca] = useState("");

  async function ler() {
    try {
      const querySnapshot = await getDocs(collection(db, "Pacientes"));

      const lista: Paciente[] = [];

      querySnapshot.forEach((document) => {
        const dados = document.data();

        lista.push({
          id: document.id,
          nome: dados.nome,
          cpf: dados.cpf,
          telefone: dados.telefone,
          convenio: dados.convenio,

          dataNascimento: dados.dataNascimento?.toDate
            ? dados.dataNascimento.toDate().toLocaleDateString("pt-BR")
            : dados.dataNascimento,
        });
      });

      setPacientes(lista);
    } catch (error) {
      console.log(error);
    }
  }

  async function excluir(id: string, nome: string) {
    Alert.alert("Excluir", `Deseja excluir ${nome}?`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "Pacientes", id));

          ler();
        },
      },
    ]);
  }

  useFocusEffect(
    useCallback(() => {
      ler();
    }, []),
  );

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const renderItem = ({ item }: any) => (
    <Card style={styles.pacienteCard}>
      <View style={styles.cardHeader}>
        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{item.nome}</Text>

          <View style={styles.iconRow}>
            <Ionicons name="call-outline" size={16} color="#718096" />

            <Text style={styles.detalheText}>{item.telefone}</Text>
          </View>

          <View style={styles.iconRow}>
            <Ionicons name="calendar-outline" size={16} color="#718096" />

            <Text style={styles.detalheText}>{item.dataNascimento}</Text>
          </View>

          <View style={styles.badgeConvenio}>
            <Text style={styles.badgeText}>{item.convenio}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => excluir(item.id, item.nome)}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.titulo}>Pacientes</Text>

            <Text style={styles.subtitulo}>{pacientes.length} cadastrados</Text>
          </View>

          <TouchableOpacity
            style={styles.btnNovo}
            onPress={() => navigation.navigate("NovoPaciente")}
          >
            <Ionicons name="add" size={20} color="#FFF" />

            <Text style={styles.btnNovoTexto}>Novo</Text>
          </TouchableOpacity>
        </View>

        <Input
          placeholder="Buscar paciente..."
          iconName="search"
          value={busca}
          onChangeText={setBusca}
        />

        <FlatList
          data={pacientesFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
