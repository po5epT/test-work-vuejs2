<template>
  <div class="starship">
    <div v-if="isLoading">Loading...</div>
    <pre v-else>{{ starship }}</pre>
  </div>
</template>

<script>
import axios from 'axios';
import { apiEndPoint } from '@/config';

export default {
  name: 'StarshipsItemPage',
  props: {
    id: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      starship: null,
    };
  },
  methods: {
    async fetchStarship(id) {
      try {
        this.isLoading = true;
        const response = await axios.get(apiEndPoint + '/' + id);
        this.starship = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.fetchStarship(this.id);
  },
};
</script>
