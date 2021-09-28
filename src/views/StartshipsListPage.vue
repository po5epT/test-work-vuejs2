<template>
    <div class="starships">
        <h1>Starships</h1>

        <input type="text" v-model="search" placeholder="Name of starship">

        <div>
            <button @click="getPrev" :disabled="!prev">Prev</button>
            <button @click="getNext" :disabled="!next">Next</button>
        </div>

        <div v-if="isLoading">Loading...</div>

        <ul v-else>
            <li v-for="starship in filteredStarships" :key="starship.id">
                <router-link :to="{name: 'StarshipsItemPage', params: {id: starship.id}}">{{ starship.name }}</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
import axios from 'axios';
import {apiEndPoint} from '@/config';

export default {
    name: 'StarshipsListPage',
    data() {
        return {
            isLoading: false,
            starships: [],

            search: this.$route.query.search || '',

            page: 1,
            next: null,
            prev: null
        };
    },
    computed: {
        currentApiEndPoint() {
            return apiEndPoint + (this.page > 1 ? '?page=' + this.page : '');
        },

        filteredStarships() {
            const regex = new RegExp(this.search, 'i');

            return this.starships.filter(starship => regex.test(starship.name));
        }
    },
    methods: {
        async fetchStarships() {
            try {
                this.isLoading = true;

                const response = await axios.get(this.currentApiEndPoint);
                this.starships = response.data.results.map(starship => {
                    starship.id = starship.url
                    .replace(apiEndPoint, '')
                    .replaceAll('/', '');

                    return starship;
                });
                this.next = response.data.next;
                this.prev = response.data.previous;
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        },

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
        }
    },
    created() {
        this.fetchStarships();
    },

    watch: {
        search() {
            const query = this.search ? {search: this.search} : null;

            this.$router.replace({query});
        }
    }
};
</script>
