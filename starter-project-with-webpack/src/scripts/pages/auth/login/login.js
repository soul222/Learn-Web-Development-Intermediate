import LoginPresenter from "./LoginPresenter";
import * as StoriesAPI from "../../../data/api";
import * as AuthModel from "../../../utils/auth";
import Swal from "sweetalert2";

export default class Login {
  #presenter = null;

  async render() {
    return `
            <section class="login-container">
                <article class="login-form-container">
                  <h1 class="login__title">Log In</h1>
                  <form id="login-form" class="login-form">
                    <div class="form-control">
                      <label for="email-input" class="login-form__email-title">Email</label>
                    
                      <div class="login-form__title-container">
                        <input id="email-input" type="email" name="email" placeholder="email">
                      </div>
                    </div>
                    <div class="form-control">
                      <label for="password-input" class="login-form__password-title">Password</label>
                      <div class="login-form__title-container">
                        <input id="password-input" type="password" name="password" placeholder="Password">
                      </div>
                    </div>
                    <div class="form-buttons login-form__form-buttons">
                      <div id="submit-button-container">
                        <button class="btn" type="submit">Log in</button>
                      </div>
                      <p class="login-form__do-not-have-account">Don't have an account? <a href="#/register">Sign Up</a></p>
                    </div>
                  </form>
                </article>
            </section>
        `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoriesAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };

        await this.#presenter.getLogin(data);
      });
  }

  loginSuccessfully(message) {
    console.log(message);

    location.hash = "/";
  }

  loginFailed(message) {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: message,
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("User acknowledged the error.");
      }
    });
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
            <button class="btn" type="submit" disabled>
                <i class="fa fa-spinner loader-button"></i>
            </button>
        `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
            <button class="btn" type="submit">Masuk</button>
        `;
  }
}
