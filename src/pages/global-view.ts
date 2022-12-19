import { getItemFromLocalStorage, clearLocalStorage } from "../utils";
import { UserData } from "../../types";

export type NavProps = {
    url: string,
    title: string,
}
let user: UserData = getItemFromLocalStorage('user');
console.log('user', user)
export default class GlobalView {
    params: any;
    navLink: NavProps[];
    constructor(params: any) {
        this.params = params;
    }

    setTitle(title: string) {
        document.title = title;
    }

    navBar() {
        return `
            <header>
                <nav class="sticky top-0 flex flex-row items-center justify-between py-4 px-4 bg-white-700 text-slate-700 shadow-sm">
                    <a href="/">CutSession</a>
                    ${this.navLink && !user ? `
                    <ul class="list-none flex">
                    ${this.navLink.map((link) => `
                                <li class="mr-2 text-sm ">
                                <a href="${link.url}" data-link>${link.title}</a>
                                </li>
                                `
                    ).join("")}
                    </ul>
                    ` : ""}
                    ${user ? `<button class="cursor-pointer text-sm" id="logout-btn">Logout</button>` : ''} 
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