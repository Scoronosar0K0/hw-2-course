import { deletePost } from "../api.js";

export const initDeleteButtonListener = ({ token }) => {
    const buttonDeleteList = document.querySelectorAll(".delete-button");
    for (const buttonDelete of buttonDeleteList) {
        buttonDelete.addEventListener("click", () => {

            const id = buttonDelete.dataset.id;
            const index = buttonDelete.dataset.index;

            deletePost({ id, token})
            .then(() => {
             const postsList = document.querySelectorAll(".post")[index];
             postsList.innerHTML = "";
            })
        })
    }
}







