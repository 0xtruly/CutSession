import GlobalView, {NavProps} from "../global-view";
import axiosInstance from "../../utils/axiosInstance";
import { UserData, StudioSessionsResDto, ACCESS_TYPE } from './../../../types';
import { getItemFromLocalStorage } from "../../utils";

export default class MerchantStudioSessions extends GlobalView {
    constructor(params: any) {
        super(params);
        this.setTitle("Merchant  ");
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

    static formatTime(time: string) {
        const [hour, minute] = time.split(":")
        return `${hour}:${minute}`
      }

    static renderMerchantStudioSessions(item: StudioSessionsResDto, index: number) {
            const { merchantId, endsAt, startsAt, type, id } = item
            return `
                <div key="${id}" class="bg-custom-gold-light flex-grow  border border-secondary rounded-lg overflow-hidden w-full px-7 py-3 mb-4 relative  flex items-center justify-between bg-white">
                    <div>
                    <p class="font-medium text-gray-text-200 mb-0.5">
                       Session No.${index + 1}
                    </p>
                    <p class="text-sm text-gray-text-100">
                    ${this.formatTime(startsAt)} — ${this.formatTime(endsAt)} on ${type+"s"}
                    </p>
                    </div>
                    <a href="/session/book/${id}" class="focus:outline-none flex cursor-pointer items-center justify-center px-3 py-2.5 border rounded border-gray-400 bg-slate-700 ">
                        <p  class="focus:outline-none text-xs md:text-sm leading-none text-white">Book Session</p>
                    </a>
                </div>
                `;
    }

    async renderHtml() {
        return `
        ${this.navBar()}
        <main class="flex justify-center py-4">
        <div class="bg-gray-100 w-full max-w-2xl px-4 border rounded-lg pb-6 border-gray-200 dark:border-gray-300 min-h-screen" >
            <div class="flex items-center border-b border-gray-200 dark:border-gray-700  justify-between px-6 py-3">
                <p class="focus:outline-none text-base lg:text-xl font-semibold leading-tight text-gray-600">Studio Sessions</p>
            </div>
            <div id="merchantList" class="max-w-2xl w-full m-auto mt-8">
                Loading...
            </div>
        </div>
        </main>
        `
    }

}

const fetchStudioSessions = async (merchantId: string) => {
    const options = {
        method: 'GET',
        url: `/studios/${merchantId}`,
        headers: {'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true'}
      };
    try {
      const response = await axiosInstance.request(options);
      return response.data
    } catch (error) {
      console.error(error);
    }
  }


const loadStudioSessions = async() => {
    let user: UserData = getItemFromLocalStorage('user');
    if (window.location.pathname.startsWith("/merchant/session")) {
            const merchantId = window.location.pathname.replace("/merchant/session/", "")
            const data: StudioSessionsResDto[] = await fetchStudioSessions(merchantId);
        let userDetailCard = data.map((item, i) => {
          return MerchantStudioSessions.renderMerchantStudioSessions(item, i)
        }).join("")
    
        let merchantDom = document.getElementById("merchantList")
        if (merchantDom) {
          merchantDom.innerHTML = userDetailCard
        }
        }
};
document.addEventListener(
    "DOMContentLoaded", loadStudioSessions
  );