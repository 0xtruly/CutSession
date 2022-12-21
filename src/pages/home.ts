import GlobalView, {NavProps} from "./global-view";

export default class Home extends GlobalView {
    constructor(params: any) {
        super(params);
        this.setTitle("Home")
    }

    navLink: NavProps[] = [
        {
            url: '/user/login',
            title: 'User Login'
        },
        {
           url: '/merchant/login',
           title: 'Merchant Login'
        },
    ]

    async renderHtml() {
        return `
        ${this.navBar()}
        <main id="home" class="flex items-center justify-center h-screen">
            <div class="justify-center items-center text-center text-white">
            <h1 class="text-4xl font-bold">CutSession</h1>
            <p class="text-2xl leading-8">Seamless photography studio sessions</p>
            </div>
        </main>
        `
    }
}