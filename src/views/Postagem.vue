<template>
  <div id="app">
    <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
    <v-row align="center" justify="center">
      <v-col cols="10" sm="12" md="5">
        <v-card class="elevation-12">
          <v-form ref="form" v-model="valid">
            <v-toolbar>
              <v-toolbar-title align="center" justify="center">Postagem de Imagem</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <form>
                <v-text-field
                  v-model="ndescricao"
                  :rules="rulesDescricao"
                  label="Descrição da Imagem"
                  required
                ></v-text-field>
                <v-file-input
                  v-model="imagemPost"
                  :rules="rulesImage"
                  accept="image/png, image/jpeg"
                  placeholder="Selecione uma imagem"
                  prepend-icon="mdi-camera"
                  label="Imagem"
                  required
                  @change="Preview_image"
                ></v-file-input>
                <v-img :src="urlimg"></v-img>
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="!valid"
                block
                color="primary"
                @click="enviarPostagem"
              >Enviar Postagem</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import PostagemService from "../service/domain/PostagemService";
const service = PostagemService.build();

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "Postagem",
  components: { Loading },

  data: () => ({
    valid: true,
    lPostagem: [],
    nPostagem: null,
    newPostagem: [],
    ndescricao: null,
    imagemPost: null,
    urlimg: null,
    nomebotao: "Teste",
    isLoading: false,
    imageconvertida: null,

    rulesDescricao: [
      (v) => !!v || "Preenchimento Necessário",
      (v) =>
        (v && v.length <= 200 && v.length >= 3) ||
        "O campo deve ter pelo menos 3 e no maximo 200 letras",
    ],

    rulesImage: [
      (value) => !!value || "Preenchimento Necessário",
      (value) =>
        !value ||
        value.size < 2000000 ||
        "Tamanho maximo de imagem permitido e 2MB!",
    ],
  }),

  created() {
    this.initialize();
    this.fetchRecords();
    //this.fetchRecordsUsuario();
  },

  methods: {
    initialize() {
      this.newPostagem = [
        {
          id: 1,
          descricao: "testetet",
          usuario: {
            id: 1,
          },
          curtidas: 0,
          dataPost: "2020-08-10",
          fotoUrl: null,
        },
      ];
    },
    fetchRecords() {
      service.search({}).then(this.fetchRecodsSuccess);
    },

    fetchRecodsSuccess(response) {
      if (Array.isArray(response.rows)) {
        this.lPostagem = response.rows;
        return;
      }
      this.lPostagem = [];
    },

    Preview_image() {
      this.urlimg = URL.createObjectURL(this.imagemPost);
    },

    converterImagem() {},

    getBase64(file) {
      var reader = new FileReader();
      var strBase64;

      reader.readAsDataURL(file);
      reader.onload = function () {
        strBase64 = reader.result;

        strBase64 = strBase64.slice(23); //removendo: "data:image/png;base64,"
        //console.log(strBase64);

        this.newPostagem[0].fotoUrl = strBase64;

        console.log(this.newPostagem[0].fotoUrl);

        //this.salvar;
        //this.imageconvertida = strBase64;

        /*strBase64 = reader.result;
          this.imagePreview = reader.result as string;

        if (strBase64.indexOf("png") > -1) {
          strBase64 = strBase64.slice(22); //removendo: "data:image/png;base64,"
        } else if (strBase64.indexOf("jpeg") > -1) {
          strBase64 = strBase64.slice(23); //removendo: "data:image/jpeg;base64,"
        } else {
          alert("A imagem não é válida!");
        }
        this.newPostagem[0].fotoUrl = strBase64;
        this.salvar;*/

        //.bind(this) Passando Contexto "this" para poder pegar objetos de fora da função anonima
      }.bind(this);
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    },

    enviarPostagem() {
      var reader = new FileReader();
      var strBase64;

      reader.readAsDataURL(this.imagemPost);
      reader.onload = function () {
        strBase64 = reader.result;

        //strBase64 = strBase64.slice(23); //removendo: "data:image/png;base64,"
        //console.log(strBase64);

        if (strBase64.indexOf("png") > -1) {
          strBase64 = strBase64.slice(22); //removendo: "data:image/png;base64,"
        } else if (strBase64.indexOf("jpeg") > -1) {
          strBase64 = strBase64.slice(23); //removendo: "data:image/jpeg;base64,"
        } else {
          alert("A imagem não é válida!");
        }

        this.newPostagem[0].fotoUrl = strBase64;
        console.log(this.newPostagem[0].fotoUrl);
        this.newPostagem[0].descricao = this.ndescricao;
        this.isLoading = true;

        this.salvar().then(() => {
          this.isLoading = false;
          this.$router.push({ name: "Feed" });
        });

        /*setTimeout(() => {
          this.isLoading = false;
          this.$router.push({ name: "Feed" });
        }, 5000);*/

        //.bind(this) Passando Contexto "this" para poder pegar objetos de fora da função anonima
      }.bind(this);
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };

      /*reader.onloadend = function () {
        strBase64 = reader.result;

        if (strBase64.indexOf("png") > -1) {
          strBase64 = strBase64.slice(22); //removendo: "data:image/png;base64,"
        } else if (strBase64.indexOf("jpeg") > -1) {
          strBase64 = strBase64.slice(23); //removendo: "data:image/jpeg;base64,"
        } else {
          alert("A imagem não é válida!");
        }
        this.newPostagem[0].fotoUrl = strBase64;
        this.imageconvertida = strBase64;
      };
      reader.readAsDataURL(file);*/
      //this.newPostagem.descricao = this.ndescricao;

      //this.salvar();
    },

    async salvar() {
      service.create(this.newPostagem[0]);
    },

    clear() {
      this.$v.$reset();
      this.name = "";
      this.email = "";
      this.select = null;
      this.checkbox = false;
    },
  },
};
</script>