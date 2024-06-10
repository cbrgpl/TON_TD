import { createApp } from 'vue';
import App from './App.vue';

import { createPinia } from 'pinia';

import './styles/main.css';

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);

export { app };
