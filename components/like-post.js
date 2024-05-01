import { setLike, setDislike } from "../api.js";
import { user } from "../index.js";
import { getWhoLiked } from "./posts-page-component.js";

export const initButtonLikeListeners = ({ token, posts }) => {
  const buttonsLikeElement = document.querySelectorAll(".like-button");

  for (const buttonLikeElement of buttonsLikeElement) {
    buttonLikeElement.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!token) return;

      let index = buttonLikeElement.dataset.index;
      const namesList = document.querySelectorAll(".post-likes-text")[index];
      const likeImg = document.querySelectorAll(".like-img")[index];

      const post = posts[index];
      const id = post.id;

      const redHeart = './assets/images/like-active.svg';
      const blackHeart = './assets/images/like-not-active.svg';

      if (post.isLiked === true) {
        setDislike({ id, token })
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            const likesList = responseData.post.likes;
            let names = getWhoLiked(user, post, likesList);
            post.isLiked = false;
            likeImg.src = blackHeart;
            return (namesList.innerHTML = `Нравится: <strong>${names}</strong>`);
          });
      } else {
        setLike({ id, token })
          .then((response) => {
            return response.json();
          })
          .then((responseData) => {
            const likesList = responseData.post.likes;
            let names = getWhoLiked(user, post, likesList);
            post.isLiked = true;
            likeImg.src = redHeart;
            return (namesList.innerHTML = `Нравится: <strong>${names}</strong>`);
          });
      }
    });
  }
};
