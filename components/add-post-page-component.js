import { getToken, goToPage } from "../index.js";
import { uploadImage, addPost } from "../api.js";
import { POSTS_PAGE, LOADING_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { sanitizeHtml } from "./sanitizeHtml.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl }) {
  let token = getToken();

  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
            <h3 class="form-title">Добавить пост</h3>
            <div class="form-inputs">
                <div class="upload-image-container">
                    <div class="upload-image">
                    
                    <label class="file-upload-label secondary-button">
                    <input type="file" class="file-upload-input" style="display:none">
                    Выберите фото
                    </label>
                    </div>
                    </div>
                    <div class="form-error"></div>
                <label>
                    Опишите фотографию:
                    <textarea class="input textarea" rows="4"></textarea>
                </label>
                <button class="button" id="add-button">Добавить</button>
            </div>
        </div>
      </div>`;

    appEl.innerHTML = appHtml;

    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image");
    let imageUrl = "";

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      setError("");
      const textInput = document.querySelector(".textarea").value;

      if (!imageUrl) {
        return setError("Вы не загрузили картинку, попробуйте еще раз");
      }

      if (!textInput) return;

      goToPage(LOADING_PAGE);

      addPost({
        description: sanitizeHtml(textInput),
        imageUrl,
        token,
      })
        .then(() => goToPage(POSTS_PAGE))
        .catch((error) => {
          if (error.message === "Что не так с объектом") {
            alert("Попробуйте отправить пост еще раз");
            renderAddPostPageComponent({ appEl });
          }
        });
    });
  };

  render();
}
