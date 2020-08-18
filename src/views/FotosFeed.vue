<template>
  <div id="app">
    <v-app id="inspire">
      <v-card class="mx-auto">
        <v-container fluid>
          <v-row dense class="justify-center">
            <v-col v-for="postagem in lPostagem" :key="postagem.id" :cols="12">
              <v-card>
                <v-list-item>
                  <v-list-item-avatar color="grey">
                    <v-img :src="carregadorFotoPerfil(postagem.idUsuario)" class="white--text align-end"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="headline" v-text="carregadorNomePerfil(postagem.idUsuario)"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-img :src="postagem.fotoUrl"></v-img>
                <v-card-text v-text="postagem.descricao"></v-card-text>
                <v-card-actions>
                  <v-btn outlined>
                    <v-icon>mdi-thumb-up</v-icon>
                    <v-card-text v-text="postagem.curtidas"></v-card-text>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-app>
  </div>
</template>

<script>
import PostagemService from "../service/domain/PostagemService";
const service = PostagemService.build();

import UsuarioService from "../service/domain/UsuarioService";
const serviceUsuario = UsuarioService.build();

export default {
  name: "Feed",
  components: {},

  data: () => ({
    lPostagem: [],
    lUsuario: [],
    linkImagem: null,
    nomePerfil: null,
    cards: [
      {
        title: "Pre-fab homes",
        descri: "Imagem 01",
        userid: 1,
        curtidas: 4,
        src: "https://cdn.vuetifyjs.com/images/cards/house.jpg",
        flex: 10,
      },
      {
        title: "Favorite road trips",
        descri: "Imagem 02",
        userid: 2,
        curtidas: 5,
        src: "https://cdn.vuetifyjs.com/images/cards/road.jpg",
        flex: 10,
      },
      {
        title: "Best airlines",
        descri: "Imagem 03",
        userid: 3,
        curtidas: 5,
        src: "https://cdn.vuetifyjs.com/images/cards/plane.jpg",
        flex: 10,
      },
    ],

    usuarios: [
      {
        nome: "Jose Silva",
        userid: 1,
        src:
          "https://firebasestorage.googleapis.com/v0/b/instalite-a2029.appspot.com/o/perfil03.png?alt=media&token=5f401a3f-202f-4a43-8d19-14bcc5239a5d",
      },
      {
        nome: "Fernando Buenos",
        userid: 2,
        src:
          "https://firebasestorage.googleapis.com/v0/b/instalite-a2029.appspot.com/o/perfil03.png?alt=media&token=5f401a3f-202f-4a43-8d19-14bcc5239a5d",
      },
      {
        nome: "Rock Lee",
        descri: "Imagem 03",
        userid: 3,
        src:
          "https://firebasestorage.googleapis.com/v0/b/instalite-a2029.appspot.com/o/perfil03.png?alt=media&token=5f401a3f-202f-4a43-8d19-14bcc5239a5d",
      },
    ],
  }),

  created() {
    this.fetchRecords();
    this.fetchRecordsUsuario();
  },

  methods: {
    fetchRecords() {
      service.search({}).then(this.fetchRecodsSuccess);
    },

    fetchRecordsMarca() {
      serviceUsuario.search({}).then(this.fetchRecodsSuccessUsuario);
    },

    fetchRecodsSuccess(response) {
      if (Array.isArray(response.rows)) {
        this.lPostagem = response.rows;
        return;
      }
      this.lPostagem = [];
    },

    fetchRecodsSuccessUsuario(response) {
      if (Array.isArray(response.rows)) {
        this.lUsuario = response.rows;
        return;
      }
      this.lUsuario = [];
    },

    carregadorFotoPerfil(iduserpassado) {
      this.lUsuario.forEach((element) => {
        if (element.id == iduserpassado) {
          this.linkImagem = element.src;
        }
      });
      return this.linkImagem;
    },

    carregadorNomePerfil(iduserpassado) {
      this.lUsuario.forEach((element) => {
        if (element.id == iduserpassado) {
          this.nomePerfil = element.nome;
        }
      });
      return this.nomePerfil;
    },
  },
};
</script>
