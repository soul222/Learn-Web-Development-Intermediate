import * as StoriesAPI from "../../../data/api";
import RegisterPresenter from "./RegisterPresenter";
import Swal from "sweetalert2";

export default class Register {
    #presenter = null;

    async render() {
        return `
            <section class="register-container">
                <div class="register-form-container">
                    <h1 class="register__title">Sign Up</h1>
                    
                    <form id="register-form" class="register-from">
                        <div class="form-control">
                            <label for="name-input" class="register-form__name-title">Username</label>
                            <div class="register-form__title-container">
                                <input id="name-input" type="text" name="name" placeholder="username">
                            </div>
                        </div>
                        <div class="form-control">      
                          <label for="email-input" class="register-form__email-title">Email</label>      
                          <div class="register-form__title-container">
                            <input id="email-input" type="email" name="email" placeholder="email">
                          </div>
                        </div>
                        <div class="form-control">       
                          <label for="password-input" class="register-form__password-title">Password</label>     
                          <div class="register-form__title-container">
                            <input id="password-input" type="password" name="password" placeholder="password">
                          </div>
                        </div>
                        <div class="form-buttons register-form__form-buttons">
                          <div id="submit-button-container">
                            <button class="btn" type="submit">Sign Up</button>
                          </div>
                          <p class="register-form__already-have-account">Have an account? <a href="#/login">Log in</a></p>
                        </div>
                    </form>
                </div>
            </section>
        `;
    }

    async afterRender() {
        this.#presenter = new RegisterPresenter({
            view: this,
            model: StoriesAPI
        });

        this.#setupForm()
    }

    #setupForm() {
        document.getElementById("register-form").addEventListener("submit", async (event) => {
            event.preventDefault();

            const data = {
                name: document.getElementById('name-input').value,
                email: document.getElementById('email-input').value,
                password: document.getElementById('password-input').value
            };

            await this.#presenter.getRegistered(data);
        });
    }

    registeredSuccessfully(message) {
        console.log(message);

        location.hash = '/login';
    }

    registeredFailed(message) {
        Swal.fire({
            icon: 'error',
            title: 'Registrasi Gagal',
            text: message,
            confirmButtonText: 'Oke',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('User acknowledged the error.');
            }
        });
    }

    showSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
            <button class="btn" type="submit" disabled>
                <i class="fa fa-spinner loader-button"></i> Daftar Akun
            </button>
        `
    }

    hideSubmitLoadingButton() {
        document.getElementById('submit-button-container').innerHTML = `
            <button class="btn" type="submit">Daftar Akun</button>
        `
    }
}