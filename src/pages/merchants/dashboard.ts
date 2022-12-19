import GlobalView, {NavProps} from "../global-view";
import axios from "axios";
import {API_BASE_URL} from "../../../config";
import axiosInstance from "../../utils/axiosInstance";
import { UserData, StudioSessionsResDto, ACCESS_TYPE } from './../../../types';
import { getItemFromLocalStorage } from "../../utils";

export default class StudioSessions extends GlobalView {
    constructor(params: any) {
        super(params);
        this.setTitle("Dashboard");
    }

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
                <a href="/merchant/session/create" class="focus:outline-none flex cursor-pointer items-center justify-center px-3 py-2.5 border rounded border-gray-400 bg-slate-700 ">
                    <p  class="focus:outline-none text-xs md:text-sm leading-none text-white">Create Session</p>
                </a>
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
      console.log('response', response)
      return response.data
    } catch (error) {
      console.error(error);
    }
  }


const loadStudioSessions = async() => {
    if (window.location.pathname === "/merchant/dashboard") {
        let user: UserData = getItemFromLocalStorage('user');
        const merchantId = (user && user.merchantId.length >= 15) ? user.merchantId : "6cbfba82-c0f9-4a28-e093-ae93ea99a070"
        const data: StudioSessionsResDto[] = await fetchStudioSessions(merchantId);
        let userDetailCard = data.map((item, i) => {
          return StudioSessions.renderMerchantStudioSessions(item, i)
        }).join("")
    
        let merchantDom = document.getElementById("merchantList")
        if (merchantDom) {
          merchantDom.innerHTML = userDetailCard
        }
      }
};
window.addEventListener(
    "DOMContentLoaded", loadStudioSessions
  );