import GlobalView, {NavProps} from "../global-view";
import axios from "axios";
import {API_BASE_URL} from "../../../config";
import axiosInstance from "../../utils/axiosInstance";
import { LoginDto, UserLoginResDto, ACCESS_TYPE } from './../../../types';

export default class MerchantList extends GlobalView {
    constructor(params: any) {
        super(params);
        this.setTitle("Dashboard");
    }

    protectedLink: NavProps[] = [
        {
            url: '/session/bookings',
            title: 'My Bookings'
        },
    ]

    static renderMerchantComponent(item: UserLoginResDto) {
            const { phoneNumber, name, cityOfOperation, email, merchantId, userId, cityOfResidence } = item
            const id = merchantId ?? userId;
            const city = cityOfOperation ?? cityOfResidence;
            return `
                    <a href="/merchant/session/${id}" id="${id}" class="flex-grow rounded w-80 lg:w-1/4 shadow-xl shadow-gray-100/50 py-3 bg-white border border-card">
                        <div class="flex flex-col items-center">
                            <div class="photo-wrapper p-2 mb-2">
                            <img 
                                class="w-12 h-12 rounded-full mx-auto" 
                                src="https://httstweuimages.blob.core.windows.net/1e5bf419-6afd-4448-ac79-a12f9b24ccf2/55e10fad-ce67-4b49-abf5-bf925213f1c5" 
                                alt="${name}">
                            </div>
                            <p class="font-medium text-base capitalize">${name}</p>
                            <p class="font-light text-sm text-gray-600">${city}</p>
                        </div>

                        <div class="my-2 border-t-2 border-slate-200">
                            <p class="text-gray-600 ml-2 text-xs lg:text-sm text-ellipsis overflow-hidden ..."> Email: ${email}</p>
                            <p class="text-gray-600 ml-2 text-xs lg:text-sm">Phone: ${phoneNumber}</p>
                        </div>
                    </a>
                `;

    }

    async renderHtml() {
        return `
        ${this.navBar()}
        <main class="h-screen w-screen bg-gray-100">
        <div class="p-8 bg-gray-100 flex gap-8 flex-wrap md:flex-row" id="merchantList" >
        Loading...
        </div>
        </main>
        `
    }

}

const fetchMerchant = async () => {
    const options = {
        method: 'GET',
        url: `/clients`,
        params: {type: `${ACCESS_TYPE.MERCHANT}`, limit: '20', offset: '1'},
        headers: {'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true'}
      };
    try {
      const response = await axiosInstance.request(options);
      return response.data.data
    } catch (error) {
      console.error(error);
    }
  }

const loadMerchant = async() => {
    if (window.location.pathname === "/user/dashboard") {
        const data: UserLoginResDto[] = await fetchMerchant();
        let userDetailCard = data.map(item => {
          return MerchantList.renderMerchantComponent(item)
        }).join("")
    
        let merchantDom = document.getElementById("merchantList")
        if (merchantDom) {
          merchantDom.innerHTML = userDetailCard
        }
      }
};
window.addEventListener(
    "DOMContentLoaded", loadMerchant
  );