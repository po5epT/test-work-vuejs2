<template>
  <div class="starships">
    <h1>Starships</h1>

    <input
      v-model="search"
      type="text"
      placeholder="Name of starship"
    >

    <div>
      <button
        @click="getPrev"
        :disabled="!prev"
      >
        Prev
      </button>

      <button
        @click="getNext"
        :disabled="!next"
      >
        Next
      </button>
    </div>

    <div v-if="isLoading">Loading...</div>

    <ul v-else>
      <li
        v-for="starship in starships"
        :key="starship.id"
      >
        <router-link :to="{
          name: 'StarshipsItemPage',
          params: { id: starship.id }
        }"
        >
          {{ starship.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import axios from 'axios';
import { throttle } from 'lodash';
import { apiEndPoint, apiRequestDelay } from '@/config';

export default {
  name: 'StarshipsListPage',
  data() {
    return {
      isLoading: false,
      starships: [],

      search: this.$route.query.search || '',

      page: 1,
      next: null,
      prev: null,
    };
  },
  computed: {
    params() {
      return {
        page: this.page,
        search: this.search,
      };
    },
  },

  methods: {
    fetchStarships: throttle(async function() {
      try {
        this.isLoading = true;

        const { data } = await axios.get(apiEndPoint, { params: this.params });

        this.starships = data.results.map(starship => {
          starship.id = starship.url
            .replace(apiEndPoint, '')
            .replaceAll('/', '');

          return starship;
        });
        this.next = data.next;
        this.prev = data.previous;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    }, apiRequestDelay),

    getPrev() {
      if (!this.prev) {
        return;
      }

      this.page--;
      this.fetchStarships();
    },

    getNext() {
      if (!this.next) {
        return;
      }

      this.page++;
      this.fetchStarships();
    },
  },
  created() {
    this.fetchStarships();
  },

  watch: {
    search() {
      const search = this.search ? this.search : null;

      this.$router.replace({ query: { search } });
      this.fetchStarships();
    },
  },
};
</script>
