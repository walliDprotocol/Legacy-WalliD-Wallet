<template>
  <div v-bind:class="flipped ? 'flip-container flipped' : 'flip-container'">
    <div class="flipper">
      <div
        class="front"
        :class="{ 'page-to-print': print }"
        style="background-position: center; background-size: contain;"
        :style="backgroundStyle"
      >
        <BackgroundCard
          id="svg-background"
          v-if="hasColor && !background"
          :fstColor="hasColor"
          :sndColor="hexToRgbA(hasColor)"
          :style="backgroundStyleSvg"
          class="background-card"
        >
        </BackgroundCard>

        <slot name="front"></slot>
        <v-btn
          class="rotate-btn"
          v-if="hasBack && !print"
          :ripple="false"
          text
          @click="$emit('flipped', true)"
        >
          <IconRotate />
        </v-btn>
      </div>
      <div
        v-if="hasBack"
        class="back"
        :class="{ 'page-to-print': print }"
        style="background-position: center; background-size: contain;"
      >
        <slot name="back"></slot>
        <v-btn
          class="rotate-btn"
          v-if="hasBack && !print"
          :ripple="false"
          text
          @click="$emit('flipped', false)"
        >
          <IconRotate />
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import IconRotate from "./assets/icon-rotate";
import BackgroundCard from "./assets/background";

export default {
  name: "FlipCard",
  props: [
    "hasBack",
    "isForeign",
    "flipped",
    "height",
    "width",
    "background",
    "hasColor",
    "print",
    "proof_url",
  ],
  components: {
    IconRotate,
    BackgroundCard,
  },
  created() {
    console.log("background", this.background);
    console.log("hasColor", this.hasColor);
  },
  computed: {
    backgroundStyleSvg() {
      return `height: ${this.height}px; width: ${this.width}px;`;
    },
    backgroundStyle() {
      return `height: ${this.height}px; width: ${this.width}px; background-image: url(${this.background})`;
    },
  },
  methods: {
    hexToRgbA(hex) {
      var c;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length == 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        return (
          "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",1)"
        );
      } else {
        return "rgba(201, 201, 201, 0.4)";
      }
    },
  },
  data() {
    return {
      size: 120,
      foreground: "#000000",
    };
  },
};
</script>

<style lang="scss">
.print-a4 {
  &.flip-container {
    .back {
      transform: rotateY(0deg);
    }
    .front,
    .back {
      border-radius: 0;
    }
  }
}
</style>

<style lang="scss" scoped>
#svg-background {
  border-radius: 14px;
}

.background-card {
  z-index: -1;
  position: absolute;
}
img.frontFlipBtn,
img.backFlipBtn {
  position: absolute;
  right: 0px;
  bottom: 0px;
  color: #ffffff;
  cursor: pointer;
}

.card .img-top {
  display: none;
  position: absolute;
  z-index: 99;
}

.card:hover .img-top {
  display: inline;
}

.unlock .img-top {
  display: none;
  position: absolute;
  z-index: 99;
}

.unlock:hover .img-top {
  display: inline;
}

i.backFlipBtn {
  -webkit-transform: rotateY(-180deg);
  -moz-transform: rotateY(-180deg);
  -o-transform: rotateY(-180deg);
  -ms-transform: rotateY(-180deg);
  transform: rotateY(-180deg);
}
.flip-container {
  min-height: 120px;
  -webkit-perspective: 1000;
  -moz-perspective: 1000;
  -o-perspective: 1000;
  perspective: 1000;

  .flipper {
    -moz-transform: perspective(1000px);
    -moz-transform-style: preserve-3d;
    position: relative;
    height: inherit;
    .rotate-btn {
      position: absolute;
      right: 0px;
      bottom: -20px;
      border: none;
      border-radius: 50%;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1) !important;
      background-color: #ffffff;
      min-width: unset;
      height: 44px;
      width: 44px;
      svg {
        margin-top: 5px;
      }
    }
  }
}

.front,
.back {
  height: inherit;

  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: 0.6s;
  -webkit-transform-style: preserve-3d;
  -moz-transition: 0.6s;
  -moz-transform-style: preserve-3d;
  -o-transition: 0.6s;
  -o-transform-style: preserve-3d;
  -ms-transition: 0.6s;
  -ms-transform-style: preserve-3d;
  transition: 0.6s;
  transform-style: preserve-3d;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 18px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.back {
  transform: rotateY(-180deg);
  position: absolute;
  .row {
    min-height: unset !important;
    align-content: flex-start !important;
  }
}

.flip-container.flipped .back {
  transform: rotateY(0deg);
}
.flip-container.flipped .front {
  transform: rotateY(180deg);
}
.front {
  z-index: 2;
  .qr-code {
    position: absolute;
    top: 0px;
    right: 0px;

    width: auto;
    max-width: 137px;
    height: auto;
    max-height: 137px;
  }
}
</style>
