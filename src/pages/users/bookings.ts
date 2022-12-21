import GlobalView, {NavProps} from "../global-view";
import axiosInstance from "../../utils/axiosInstance";
import { UserData, BookedSessionDto, BookedSessionResDto, ACCESS_TYPE } from './../../../types';
import { getItemFromLocalStorage } from "../../utils";

export default class BookedSessions extends GlobalView {
    constructor(params: any) {
        super(params);
        this.setTitle("Booked Sessions");
    }

    protectedLink: NavProps[] = [
      {
          url: '/user/dashboard',
          title: 'Merchants'
      },
  ]


    static formatTime(time: string) {
        const [hour, minute] = time.split(":")
        return `${hour}:${minute}`
      }

    static renderMerchantStudioSessions(item: BookedSessionResDto, index: number) {
            const { date, endsAt, startsAt, title, bookingId, bookingRef, notes } = item
            return `
                <div key="${bookingId}" class="bg-custom-gold-light flex-grow  border border-secondary rounded-lg overflow-hidden w-full px-7 py-3 mb-4 relative  flex items-center justify-between bg-white">
                    <div>
                    <p class="font-bold text-gray-text-200 mb-0.5">
                       Session ${bookingRef}
                    </p>
                    <p class="font-medium text-gray-text-200 mb-0.5 capitalize">
                       ${title}
                    </p>
                    <p class="text-sm text-slate-500 leading-6">
                    ${notes}
                    </p>
                    <p class="text-sm text-gray-text-100 leading-6">
                    ${date} from ${this.formatTime(startsAt)} — ${this.formatTime(endsAt)}
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
            <div class="flex flex-col border-b border-gray-200 dark:border-gray-700  justify-between px-2 py-3">
                <p class="focus:outline-none text-base lg:text-xl font-semibold leading-tight text-gray-600 my-2">Booked Sessions</p>
                <div class="bg-white shadow-md rounded px-4 py-4 ">
                    <form class="text-sm" id="sessions">
                        <div class="flex flex-wrap">
                            <div class="flex-grow mt-4">
                                <label class="block text-gray-700 font-medium" for="city">City</label>
                                <input name="city" data-city id="city" type="text" placeholder="lagos" class="text-base border h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded" required>
                            </div>
                            
                            <div class="flex-grow mt-4">
                                <label class="block text-gray-700 font-medium" for="merchant">Merchant</label>
                                <input name="merchant" data-merchant id="merchant" type="text" placeholder="name or id" class="text-base border h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>

                            <div class="flex-grow mt-4">
                                <label class="block text-gray-700 font-medium" for="startsAt">StartsAt</label>
                                <input name="startsAt" data-startsat id="startsAt" type="datetime-local" class="text-base border h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>

                            <div class="flex-grow mt-4">
                                <label class="block text-gray-700 font-medium" for="endsAt">EndsAt(optional)</label>
                                <input name="endsAt" data-endsat id="endsAt" type="datetime-local"  class="text-base border h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded" disabled>
                            </div>
                        </div>
                        <button type="submit" class="flex justify-center rounded-md border border-transparent bg-slate-700 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 mt-4">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            <div id="sessionList" class="max-w-2xl w-full m-auto mt-8">
                
            </div>
        </div>
        </main>
        `
    }

}

const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
const formatTime = (date: string) => {
    const unixTmp = Math.floor(new Date(date).getTime())
    return new Date(unixTmp - timeZoneOffset).toISOString().split("T")[1]
}

const fetchBookings = async (params: BookedSessionDto) => {
  let merchantDom = document.getElementById("sessionList")
  merchantDom.innerHTML = "Loading...."
    const options = {
        method: 'GET',
        url: `/bookings`,
        params: { limit: '20', offset: '1', ...params},
        headers: {'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true'}
      };
    try {
      const response = await axiosInstance.request(options);
      const {data} = response.data;
      if (data.length > 0) {
        let userDetailCard = data.map((item, i) => {
          return BookedSessions.renderMerchantStudioSessions(item, i)
        }).join("")
    
        if (merchantDom) {
          merchantDom.innerHTML = userDetailCard
        }
      } else {
        merchantDom.innerHTML = "No Results"
      }
    } catch (error) {
      console.error(error);
    }
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const formEl = e.target;
    var formData = new FormData(formEl);
    let params: BookedSessionDto | Record<string, string> = {}
    for (const item of formData.entries()) {
      if (!!item[1]) {
        params[item[0]] = item[1] as string
      }
    }
    if (!!params.startsAt || !!params.endsAt) {
      params.period = (!!params.startsAt && !!params.endsAt) 
      ? `${formatTime(params.startsAt)}:${formatTime(params.endsAt)}` 
      : (!!params.startsAt && !params.endsAt)
      ? `${formatTime(params.startsAt)}`
      : '';
    } 
  
    if (params.startsAt || params.endsAt) {
      delete(params.startsAt)
      delete(params.endsAt)
    }
    await fetchBookings(params)
}

document.body.addEventListener('submit', async (e) => {
    if (e && (e.target as HTMLButtonElement).id === 'sessions') {
        await submitForm(e)
    }
})

document.body.addEventListener('change', async (e) => {
  const endPeriodField = document.querySelector('#endsAt')
    if (e && (e.target as HTMLInputElement).id === 'startsAt') {
        if (!!e.target.value && !!endPeriodField) {
          endPeriodField.disabled = false;
        }
    }
})


const loadStudioSessions = async() => {
    if (window.location.pathname === "/merchant/dashboard") {
        let user: UserData = getItemFromLocalStorage('user');
        const merchantId = (user && user.merchantId.length >= 15) ? user.merchantId : "6cbfba82-c0f9-4a28-e093-ae93ea99a070"
        const data: BookedSessionResDto[] = await fetchStudioSessions(merchantId);
        let userDetailCard = data.map((item, i) => {
          return StudioSessions.renderMerchantStudioSessions(item, i)
        }).join("")
    
        let merchantDom = document.getElementById("sessionList")
        if (merchantDom) {
          merchantDom.innerHTML = userDetailCard
        }
      }
};
window.addEventListener(
    "DOMContentLoaded", loadStudioSessions
  );