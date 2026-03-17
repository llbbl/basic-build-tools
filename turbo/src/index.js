import { h, render } from 'preact';
import htm from 'htm';
import './styles.css';

const html = htm.bind(h);

function HelloWorld() {
  return html`<h1 class="text-4xl">Hello World</h1>`;
}

render(html`<${HelloWorld} />`, document.getElementById('app'));
