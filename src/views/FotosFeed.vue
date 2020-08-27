<template>
  <div id="app">
    <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
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
                <v-btn outlined @click="addCurtida(postagem.id)">
                  <v-icon>mdi-thumb-up</v-icon>
                  <v-card-text v-text="postagem.curtidas"></v-card-text>
                </v-btn>
                <v-btn outlined @click="verComentario(postagem.id)">
                  <v-icon>mdi-message-text</v-icon>
                  <v-card-text>Ver Comentários</v-card-text>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="dialog" max-width="500">
        <v-card class="white lighten-2">
          <loading :active.sync="isLoading2" :is-full-page="fullPage"></loading>
          <v-col v-for="comentario in lComentario" :key="comentario.id">
            <v-list-item>
              <v-list-item-avatar color="grey">
                <v-img
                  :src="'data:image/png;base64,'+comentario.usuario.fotoPerfil"
                  class="white--text align-end"
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-subtitle v-text="comentario.usuario.nome+' : '"></v-list-item-subtitle>
                <v-text-field dense v-text="comentario.comentario" required></v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-col>

          <v-form v-model="valid">
            <v-card>
              <v-col cols="auto" sm="auto" md="auto">
                <v-text-field
                  v-model="nComentario"
                  label="Novo Comentário"
                  outlined
                  required
                  :rules="rulesComentario"
                ></v-text-field>
                <v-btn
                  :disabled="!valid"
                  block
                  color="primary"
                  @click="enviarComentario(lComentario[0].postagem.id)"
                >Enviar Comentário</v-btn>
              </v-col>
            </v-card>
          </v-form>
        </v-card>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
import PostagemService from "../service/domain/PostagemService";
const service = PostagemService.build();

import ComentarioService from "../service/domain/ComentarioService";
const serviceComentario = ComentarioService.build();

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "Feed",
  components: { Loading },

  data: () => ({
    componentKey: 0,
    lPostagem: [],
    lComentario: [],
    aPostagem: null,
    linkImagem: null,
    nomePerfil: null,
    isLoading: true,
    isLoading2: false,
    fullPage: false,
    dialog: false,
    valid: true,
    nComentario: null,
    newComentario: [],

    rulesComentario: [
      (v) => !!v || "Preenchimento Necessário",
      (v) =>
        (v && v.length <= 200 && v.length >= 3) ||
        "O campo deve ter pelo menos 3 e no maximo 200 letras",
    ],
  }),

  watch: {
    dialog(val) {
      val || this.resetComentario();
    },
  },

  created() {
    this.initialize();
    this.fetchRecords();
    //this.fetchRecordsUsuario();
  },

  methods: {
    initialize() {
      this.newComentario = [
        {
          id: 1,
          comentario: "",
          usuario: {
            id: 1,
          },
          postagem: {
            id: 1,
          },
          dataComentario: "2020-08-10",
        },
      ];
    },
    fetchRecords() {
      service.search({}).then(this.fetchRecodsSuccess);
    },

    fetchRecordsComentario(query) {
      serviceComentario.search(query).then(this.fetchRecodsSuccessComentario);
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

    fetchRecodsSuccessComentario(response) {
      if (Array.isArray(response.rows)) {
        this.lComentario = response.rows;
        this.isLoading2 = false;
        return;
      }
      this.lComentario = [];
    },

    buscarComentarios(id) {
      this.isLoading2 = true;
      const query = this.getQueryUrlBuscaComentariosPorPostagem(id);
      //this.resetSelecaoDispositivo();
      this.fetchRecordsComentario(query);
    },

    getQueryUrlBuscaComentariosPorPostagem(id) {
      return `findByPostagem/${id}`;
    },

    resetComentario() {
      this.lComentario = [];
    },

    verComentario(id) {
      this.dialog = true;
      this.buscarComentarios(id);
    },

    enviarComentario(id) {
      this.newComentario[0].postagem.id = id;
      this.newComentario[0].comentario = this.nComentario;
      this.salvarComentario().then(() => {
        this.buscarComentarios(id);
        this.nComentario = null;
      });
    },

    async salvarComentario() {
      await serviceComentario.create(this.newComentario[0]);
    },

    addCurtida(idPostagem) {
      for (let index = 0; index < this.lPostagem.length; index++) {
        const element = this.lPostagem[index];
        if (element.id == idPostagem) {
          this.aPostagem = element;
          this.aPostagem.curtidas =
            parseFloat(this.aPostagem.curtidas) + parseFloat(1);
          service
            .update(this.aPostagem)
            .then(Object.assign(this.lPostagem[index], this.aPostagem));
        }
      }
    },
  },
};
</script>
