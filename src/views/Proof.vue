<template>
  <v-container class="proof-view pa-5">
    <v-row>
      <v-col cols="12" class="pt-1">
        <div class="back-arrow mb-4">
          <v-btn text @click="$router.go('-1')" class="back-btn">
            <ArrowBack />
          </v-btn>
          <h2 class="T1 text-left">
            {{ $t('proof.title') }}
            {{ credentialName }}
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="!linkProof" class="">
      <v-form @submit.prevent="generateProof" ref="form">
        <v-col cols="12" class="pt-1">
          <h3 class="sub-title-fields text-left">
            {{ $t('proof.text') }}
          </h3>
        </v-col>
        <v-col cols="12" class="pt-0  text-left">
          <label class="sub-title-fields ">{{ $t('proof.url') }}</label>
          <v-text-field
            v-model="url"
            class="password-input mt-1"
            flat
            solo
            :hint="$t('proof.hint')"
            @input="checkURL"
            :error-messages="urlError"
            type="url"
          ></v-text-field>
          <!-- <p v-show="urlError" class="error--text">
            {{ $t("proof.urlError") }}
          </p> -->
        </v-col>
        <v-col v-if="false" cols="12" class="pt-8 pb-5">
          <div class="info">
            <icon-alert />
            <p class="alerts-font">{{ $t('proof.info') }}</p>
          </div>
        </v-col>
        <v-col cols="12">
          <v-btn
            text
            :isLoading="isLoading"
            @click="generateProof"
            :disabled="isDisabled"
            class="advance-btn "
          >
            {{ $t('proof.button') }}
          </v-btn>
        </v-col>
      </v-form>
    </v-row>
    <v-row v-else class="">
      <v-col cols="12" class="pt-1">
        <h3 class="sub-title-fields text-left">
          {{ $t('proof.text1') }}
        </h3>
      </v-col>
      <v-col cols="12 text-left">
        <label class="sub-title-fields ">{{ $t('proof.link') }}</label>

        <CopyPaste :input="linkProof">
          <div @click="copyToClip" class="password-wrapper" style="">
            <div class="password-input">
              {{ linkProof }}
            </div>
          </div>
        </CopyPaste>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ArrowBack from '../images/icon-arrow-back.vue';
import IconAlert from '../images/icon-warning-red.vue';
import CopyHover from '../images/icon-copyclipboard-selected';
import Copy from '../images/icon-copyclipboard-unselected';
import { mapGetters } from 'vuex';
import { SHARE } from '../store/actions';

import CopyPaste from '../components/CopyPaste';

const VERIFY_URL = 'https://verify.wallid.io/Verify?proof=';

export default {
  components: {
    IconAlert,
    ArrowBack,
    Copy,
    CopyHover,
    CopyPaste,
  },
  created() {
    console.log('card', this.currentCred);
    this.card = this.currentCred;
  },
  beforeDestroy() {
    // this.$store.commit('setCurrentCred', null);
  },
  mounted() {
    this.linkProof =
      this.currentCred &&
      this.currentCred.userData.proof_id &&
      VERIFY_URL + this.currentCred.userData.proof_id;
  },
  computed: {
    ...mapGetters(['address', 'currentCred']),

    isDisabled() {
      return !this.url || !!this.urlError || this.isLoading;
    },
  },
  methods: {
    copyToClip() {
      const el = document.createElement('textarea');
      el.value = this.linkProof;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.show = true;
    },
    delay() {
      console.log('hover');
      setTimeout(() => {
        this.show = false;
        this.copy = false;
      }, 300);
    },
    checkURL() {
      this.urlError = '';

      var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ); // fragment locator
      if (!pattern.test(this.url)) {
        this.urlError = this.$t('proof.urlError');
      }
    },
    reconstructData(data) {
      let obj = {};

      data.front.forEach((item) => {
        console.log(item);
        obj[item.attr] = item.value;
      });
      obj['tables'] = data.table;
      console.log(obj);
      return obj;
    },

    generateProof() {
      this.debug('generateProof', this.card.userData);
      let body = {
        user_id: this.card.userData._id,
        url: this.url,
      };
      this.isLoading = true;
      this.$store
        .dispatch(SHARE, body)
        .then((response) => {
          console.log('Proof');
          console.log(response);
          this.credentialName = this.card.credName;
          this.linkProof = response.data.data.proof;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;

          console.error(err);
        });
    },
  },
  data() {
    return {
      isLoading: false,
      url: null,
      card: null,
      urlError: '',
      credentialName: '',
      linkProof: '',
      copy: false,
      show: false,
      copyBefore: {
        en: 'Copy to clipboard',
        pt: 'Copiar',
      },
      copyAfter: {
        en: 'Copied!',
        pt: 'Copiado!',
      },
    };
  },
};
</script>

<style lang="scss">
.proof-view {
  .password-wrapper {
    padding: 10px 14px 10px 15px;
    border-radius: 3px;
    border: solid 1px #b8b9bb;
    position: relative;
    padding-right: 30px;
    overflow: hidden;

    .password-input {
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: var(--charcoal-grey);
      overflow-x: hidden;
      width: 500px;
    }
  }
  #walletCopy {
    cursor: pointer;
  }
  .password-input .v-input__slot input {
    font-size: 13px !important;
  }
  div.info {
    display: flex;
    padding: 16px;
    padding-right: 16px;
    border-radius: 3px;
    background-color: var(--pale-blue) !important;
    svg {
      min-width: 22px;
      margin-top: 4px;
      g {
        fill: #009fb1;
      }
    }
    p {
      margin-left: 18px !important;
      text-align: left;
      color: var(--teal-blue) !important;
    }
  }
}
</style>
