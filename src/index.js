import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function component() {
  const div = document.createElement('div');
  div.textContent = 'KEEEEEEEEEEkeeee';
  div.classList.add('container');
  const form = document.createElement('form');
  form.classList.add('form1');
  const button = document.createElement('button');
  button.classList.add('btn', 'btn-primary');
  button.type = 'button';
  button.textContent = 'Small button';
  const input = document.createElement('input');
  form.append(button, input);
  div.append(form);
  return div;
}

document.body.append(component());
