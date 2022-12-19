import GlobalView from "./global-view";

export default class ErrorPage extends GlobalView {
    constructor(params: any) {
        super(params);
        this.setTitle("404")
    }

    async renderHtml() {
        return `
        ${this.navBar()}
        <main class="flex items-center justify-center h-full">
            <div class="justify-center items-center text-center text-black">
            <h1 class="text-xl font-bold">Page not found.</h1>
            <p>Sorry, we couldn't find the page you're looking for.</p>
            </div>
        </main>
        `
    }
}