<template>
  <div class="v-grid" :style="style">
    <GridItem
      v-for="v in list"
      :key="v.index"
      :index="v.index"
      :sort="v.sort"
      :draggable="draggable"
      :drag-delay="dragDelay"
      :row-count="rowCount"
      :cell-width="cellWidth"
      :cell-height="cellHeight"
      :window-width="windowWidth"
      :row-shift="rowShift"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @drag="onDrag"
      @click="click"
    >
      <slot
        name="cell"
        :item="v.item"
        :index="v.index"
        :sort="v.sort"
        :remove="
          () => {
            removeItem(v);
          }
        "
      >
      </slot>
    </GridItem>
  </div>
</template>
<script>
import util from "./util.js";
import GridItem from "./GridItem.vue";
export default {
  name: "Grid",
  mixins: [util],
  components: {
    GridItem,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    gridWidth: {
      type: Number,
      default: -1,
    },
    cellWidth: {
      type: Number,
      default: 116,
    },
    cellHeight: {
      type: Number,
      default: 34,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    dragDelay: {
      type: Number,
      default: 0,
    },
    sortable: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      list: [],
    };
  },
  watch: {
    items: {
      handler: function(nextItems = []) {
        this.list = nextItems.map((item, index) => {
          return {
            item,
            index: index,
            sort: index,
          };
        });
      },
      immediate: true,
    },
  },
  computed: {
    gridResponsiveWidth() {
      if (this.gridWidth < 0) {
        return this.windowWidth;
      } else {
        return Math.min(this.windowWidth, this.gridWidth);
      }
    },
    height() {
      return Math.ceil(this.list.length / this.rowCount) * this.cellHeight;
    },
    style() {
      return {
        height: this.height + "px",
      };
    },
    rowCount() {
      return 3; //Math.floor(this.gridResponsiveWidth / this.cellWidth);
    },
    rowShift() {
      if (this.center) {
        let contentWidth = this.list.length * this.cellWidth;
        let rowShift =
          contentWidth < this.gridResponsiveWidth
            ? (this.gridResponsiveWidth - contentWidth) / 2
            : (this.gridResponsiveWidth % this.cellWidth) / 2;
        return Math.floor(rowShift);
      }
      return 0;
    },
  },
  methods: {
    /* Returns merged event object */
    wrapEvent(other = {}) {
      return {
        datetime: Date.now(),
        items: this.getListClone(),
        ...other,
      };
    },
    /* Returns sorted clone of "list" array */
    getListClone() {
      return this.list.slice(0).sort((a, b) => {
        return a.sort - b.sort;
      });
      //  .map(v => {
      //    return { ...v.item }
      //  })
    },
    removeItem({ index }) {
      let removeItem = this.list.find((v) => v.index === index);
      let removeItemSort = removeItem.sort;
      this.list = this.list
        .filter((v) => {
          return v.index !== index;
        })
        .map((v) => {
          let sort = v.sort > removeItemSort ? v.sort - 1 : v.sort;
          return { ...v, sort };
        });
      this.$emit("remove", this.wrapEvent({ index }));
    },
    onDragStart(event) {
      this.$emit("dragstart", this.wrapEvent(event));
    },
    onDragEnd(event) {
      this.$emit("dragend", this.wrapEvent(event));
    },
    click(event) {
      this.$emit("click", this.wrapEvent(event));
    },
    onDrag(event) {
      if (this.sortable) {
        this.sortList(event.index, event.gridPosition);
      }
      this.$emit("drag", this.wrapEvent({ event }));
    },
    sortList(itemIndex, gridPosition) {
      let targetItem = this.list.find((item) => item.index === itemIndex);
      let targetItemSort = targetItem.sort;
      /*
        Normalizing new grid position
      */
      gridPosition = Math.max(gridPosition, 0);
      /*
        If you remove this line you can drag items to positions that
        are further than items array length
      */
      gridPosition = Math.min(gridPosition, this.list.length - 1);
      if (targetItemSort !== gridPosition) {
        this.list = this.list.map((item) => {
          if (item.index === targetItem.index) {
            return {
              ...item,
              sort: gridPosition,
            };
          }
          const { sort } = item;
          if (targetItemSort > gridPosition) {
            if (sort <= targetItemSort && sort >= gridPosition) {
              return {
                ...item,
                sort: sort + 1,
              };
            }
          }
          if (targetItemSort < gridPosition) {
            if (sort >= targetItemSort && sort <= gridPosition) {
              return {
                ...item,
                sort: sort - 1,
              };
            }
          }
          return item;
        });
        this.$emit("sort", this.wrapEvent());
      }
    },
  },
};
</script>
<style>
.v-grid {
  display: block;
  position: relative;
  width: 100%;
}
</style>
