import GlobalView, {NavProps} from "../global-view";
import axiosInstance from "../../utils/axiosInstance";
import { LoginDto, SessionBookingDto, UserData, ACCESS_TYPE } from '../../../types';
import { getItemFromLocalStorage } from "../../utils";

export default class SessionBooking extends GlobalView {
    constructor(params: any) {
        super(params);
        this.setTitle("Session Booking");
    }

    protectedLink: NavProps[] = [
        {
            url: '/user/dashboard',
            title: 'Merchants'
        },
        {
            url: '/session/bookings',
            title: 'My Bookings'
        },
    ]

    async renderHtml() {
        return `
        ${this.navBar()}
        <main id="home" class="flex items-center justify-center h-screen">
            <div class="relative pt-28 sm:w-2/6 mx-auto">
                <div class="bg-white shadow-md rounded px-12 py-12 ">
                    <h1 class="text-2xl font-semibold text-gray-900">Book a Session</h1>

                    <form class="block text-sm" id="session-booking">
                        <div>
                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="title">Title</label>
                                <input name="title" data-title id="title" type="text" placeholder="Maya&Larry" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>
                            
                            <div class="mt-6">
                                <label class="inline-block text-gray-700 font-medium" for="date">Date</label>
                                <input name="date" data-date id="date" type="date" placeholder="2022-12-12" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>

                            <div class="mt-6">
                                <label class="inline-block text-gray-700 font-medium" for="notes">Note</label>
                                <textarea name="notes" data-notes id="notes" placeholder="Add notes..." class="text-sm border w-full h-14 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded"></textarea>
                            </div>
                        </div>
                        <button type="submit" class="group relative flex w-full justify-center rounded-md border border-transparent bg-slate-700 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                            Book Session
                        </button>
                    </form>
                </div>
            </div>
        </main>
        `
    }

}

const handleSessionBooking = async (params: SessionBookingDto | Record<string, string>) => {
    const options = {
        method: 'POST',
        url: `/bookings`,
        headers: {'Content-Type': 'application/json'},
        data: {...params}
    }
    try {
        const request = await axiosInstance.request(options)
        if (request.status === 200) {
            window.history.back()
        }
    } catch (error) {
        console.log("error", error.message)
    }
}

const submitForm = async (e) => {
    e.preventDefault();
    const formEl = e.target;
    var formData = new FormData(formEl);
    let params: SessionBookingDto | Record<string, string> = {}
    for (const item of formData.entries()) {
        params[item[0]] = item[1] as string
    }
    let user: UserData = getItemFromLocalStorage('user');
    params.sessionId = window.location.pathname.replace("/session/book/", "");
    if (user && user.type === ACCESS_TYPE.USER) {
        params.userId = (user && user.userId.length >= 15) ? user.userId : "6cbfba82-c0f9-4a28-e093-ae93ea99a070"
    }
    await handleSessionBooking(params)
}

document.body.addEventListener('submit', async (e) => {
    if (e && (e.target as HTMLButtonElement).id === 'session-booking') {
        await submitForm(e)
    }
})

document.addEventListener(
    "DOMContentLoaded", () => {
        const dateField = document.querySelector('#date');
        if (dateField) {
            dateField.min = new Date().toISOString().split("T")[0]
        }
    }
  );