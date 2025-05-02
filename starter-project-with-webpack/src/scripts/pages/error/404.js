export default class NotFound {
  async render() {
    return `
        <div class='not-found'>
            <div class='_404'>404</div>
            <hr>
            <div class='_1'>THE PAGE</div>
            <div class='_2'>WAS NOT FOUND</div>
            <a class='btn' href='#'>BACK TO HOME</a>
        </div>
        `;
  }
  async afterRender() {}
}