import { connect } from '@vue/devtools';
import './demos/ipc';

import { app } from './main';
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

const connectVueDevTools = () => {
  if (import.meta.env.MODE === 'development') {
    connect('192.168.0.14', 8098);
  }
};

connectVueDevTools();

app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*');
});
