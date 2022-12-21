import { getItemFromLocalStorage, clearLocalStorage } from "../utils";
import { UserData } from "../../types";

export type NavProps = {
    url: string,
    title: string,
}
let user: UserData = getItemFromLocalStorage('user');
export default class GlobalView {
    params: any;
    navLink: NavProps[];
    protectedLink: NavProps[];
    constructor(params: any) {
        this.params = params;
    }

    setTitle(title: string) {
        document.title = title;
    }

    navBar() {
        return `
            <header class="sticky top-0 bg-white z-10">
                <nav class="flex flex-col md:flex-row items-center justify-between py-4 px-4 bg-white-700 text-slate-700 shadow-sm">
                    <a href="/" class="text-2xl text-black">CutSession</a>
                    ${this.navLink && !user ? `
                    <ul class="list-none flex">
                    ${this.navLink.map((link) => `
                                <li class="mr-2 text-sm ">
                                <a href="${link.url}" data-link>${link.title}</a>
                                </li>
                                `
                    ).join("")}
                    </ul>
                    ` : `
                    <ul class="list-none flex">
                    ${this.protectedLink ? this.protectedLink.map((link) => `
                                <li class="mr-2 text-sm ">
                                <a href="${link.url}" data-link>${link.title}</a>
                                </li>
                                `
                    ).join("") : ''}
                    ${user ? `<button class="cursor-pointer text-sm" id="logout-btn">Logout</button>` : ''} 
                    </ul>
                    `}
                </nav>
            </header>
        `;
    }

}

window.addEventListener('click', async (e) => {
    if (e && (e.target as HTMLButtonElement).id === 'logout-btn') {
        e.preventDefault();
        await clearLocalStorage();
        window.location.replace('/');
    }
})