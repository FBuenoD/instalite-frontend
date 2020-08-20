<template>
  <div id="app">
    <loading
      :active.sync="isLoading"
      :is-full-page="fullPage"
    ></loading>
    <v-app id="inspire" v-if="componentKey==1">
      <v-container fluid>
        <v-row dense class="justify-center">
          <v-col v-for="postagem in lPostagem" :key="postagem.id" :cols="6">
            <v-card>
              <v-list-item>
                <v-list-item-avatar color="grey">
                  <v-img
                    :src="'data:image/png;base64,'+postagem.usuario.fotoPerfil"
                    class="white--text align-end"
                  ></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-subtitle v-text="postagem.usuario.nome"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-img :src="'data:image/png;base64,'+postagem.fotoUrl"></v-img>
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
    </v-app>
  </div>
</template>

<script>
import PostagemService from "../service/domain/PostagemService";
const service = PostagemService.build();

import UsuarioService from "../service/domain/UsuarioService";
const serviceUsuario = UsuarioService.build();

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "Feed",
  components: { Loading },

  data: () => ({
    componentKey: 0,
    lPostagem: [],
    lUsuario: [],
    linkImagem: null,
    nomePerfil: null,
    isLoading: true,
    fullPage: false,
  }),

  created() {
    this.fetchRecords();
    //this.fetchRecordsUsuario();
  },

  methods: {
    fetchRecords() {
      service.search({}).then(this.fetchRecodsSuccess);
    },

    fetchRecordsUsuario() {
      serviceUsuario.search({}).then(this.fetchRecodsSuccessUsuario);
    },

    fetchRecodsSuccess(response) {
      if (Array.isArray(response.rows)) {
        this.lPostagem = response.rows;
        this.componentKey += 1;
        this.isLoading = false;
        return;
      }
      this.lPostagem = [];
    },

    fetchRecodsSuccessUsuario(response) {
      if (Array.isArray(response.rows)) {
        this.lUsuario = response.rows;
        this.componentKey += 1;
        return;
      }
      this.lUsuario = [];
    },

    carregadorFotoPerfil(iduserpassado) {
      this.lUsuario.forEach((element) => {
        if (element.id == iduserpassado) {
          this.linkImagem = element.fotoPerfil;
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
