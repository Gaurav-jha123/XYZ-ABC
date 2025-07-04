import { streamGemini } from './gemini-api.js';

let form = document.querySelector('form');
let promptInput = document.querySelector('input[name="prompt"]');
let output = document.querySelector('.output');
let clearButton = document.querySelector('button[id="clear-chat"]');

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  try {
    let contents = 
      {
        message: promptInput.value,
        semantics: ''
      }
    ;

    let stream = streamGemini({
      model: 'tunedModels/ustoratrainingv3-eljh14oot0de', 
      contents,
    });

    let buffer = [];
    let md = new markdownit();
    for await (let chunk of stream) {
      buffer.push(chunk);
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};

clearButton.onclick = (event) => {
  promptInput.value = '';
  output.innerHTML = '';
  const previewImage = document.getElementById('preview-image');
  previewImage.src = '';
  previewImage.style.display = 'none';
  const fileInput = document.getElementById('chosen-image-input');
  fileInput.value = ''; 
  const imageInput = document.getElementById('chosen-image');
  imageInput.value = '';
  form.reset();
}
