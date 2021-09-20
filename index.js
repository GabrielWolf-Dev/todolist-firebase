import LoginPage from './src/components/Login';
import Todo from './src/components/Todo';
import configFirebase from './src/scripts/config';

import './src/styles/elements/reset.css';
import './src/styles/generic/base.css';
import './src/styles/settings/colors.css';
import './src/styles/utilities/componentsActives.css';
import './src/styles/objects/fonts.css';

configFirebase();

const root = document.querySelector('#root');
let user = null;

root.insertAdjacentHTML('beforeend', `
    ${LoginPage(user)}
    ${Todo()}
`);
