<template>
  <div>
    <draggable
      class="list-group"
      v-model="list"
      v-bind="dragOptions"
      @start="isDragging = true"
      @end="isDragging = false"
      @change="changeHandler"
    >
      <transition-group
        type="transition"
        name="flip-list"
      >
        <div
          class="list-group-item"
          v-for="element in list"
          :key="element.id"
        >
          <q-icon name="drag_handle" />
          {{ element.name }}
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import clonedeep from 'lodash/cloneDeep';
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'transition-example',
  display: 'Transition',
  order: 6,
  components: {
    draggable,
  },
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.list = clonedeep(this.siteList);
  },
  methods: {
    ...mapMutations(['setSiteList']),
    changeHandler() {
      this.$emit('change-order', this.list);
    },
  },
  computed: {
    ...mapState({
      siteList: state => state.site.siteList,
    }),
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
  },
};
</script>

<style>
.list-group {
  display: flex;
  flex-direction: column;
}
.list-group-item {
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
