import GlobalView, {NavProps} from "../global-view";
import axios from "axios";
import {API_BASE_URL} from "../../../config";
import axiosInstance from "../../utils/axiosInstance";
import { CreateSessionDto, ACCESS_TYPE, STUDIO_SESSION_TYPE, UserData } from '../../../types';
import { getItemFromLocalStorage, saveItemToLocalStorage } from "../../utils";


export default class CreateStudioSession extends GlobalView {
    constructor(params: any) {
        super(params);
        this.setTitle("Create Session")
    }

    async renderHtml() {
        return `
        ${this.navBar()}
        <main id="home" class="flex items-center h-screen">
            <div class="relative pt-28 sm:w-2/6 mx-auto">
                <div class="bg-white shadow-md rounded px-12 py-12 ">
                    <h1 class="text-2xl font-semibold text-gray-900">Create a Studio Session</h1>

                    <form class="block text-sm" id="create-session">
                        <div>
                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="startsAt">Starts At</label>
                                <input name="startsAt" data-startsat id="startsAt" type="datetime-local"  class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>
                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="endsAt">Ends At</label>
                                <input name="endsAt" data-endsAt id="endsAt" type="datetime-local" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>
                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="type">Type</label>
                                <select name="type" data-type id="type" class="text-sm border w-full px-2 py-2  focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded text-gray-900">
                                    <option value="WeekDay">WeekDay</option>
                                    <option value="WeekEnd">WeekEnd</option>
                                </select>
                            </div>
                        </div>
                          <button type="submit" class="group relative flex w-full justify-center rounded-md border border-transparent bg-slate-700 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4">
                            Create
                        </button>

                    </form>
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
const handleCreateSession = async (params: CreateSessionDto | Record<string, string>, merchantId) => {
    try {
        const request = await axiosInstance.request({
            url: `/studios/${merchantId}`,
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            data: {...params}
        })
        if (request.status === 200) {
            window.location.href = "/merchant/dashboard"
        }
    } catch (error) {
        console.log("error", error.message)
    }
}

const submitForm = async (e) => {
    e.preventDefault();
    const formEl = e.target;
    var formData = new FormData(formEl);
    let params: CreateSessionDto | Record<string, string> = {}
    for (const item of formData.entries()) {
        params[item[0]] = item[1] as string
    }
    let user: UserData = getItemFromLocalStorage('user');
    const data = {
        ...params,
        startsAt: formatTime(params.startsAt),
        endsAt: formatTime(params.endsAt),
    }
    const merchantId = (user && user.merchantId.length >= 15) ? user.merchantId : "6cbfba82-c0f9-4a28-e093-ae93ea99a070"
    await handleCreateSession(data, merchantId);
}


const isWeekDay = (): boolean => {
    const weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekDay)
}

const loadCreateSession = async() => {
   if (window.location.pathname === '/merchant/session/create') {
    let startDateField: HTMLInputElement | any = document.querySelector('#startsAt');
    let endDateField: HTMLInputElement | any = document.querySelector('#endsAt');
    let weekTypeField: HTMLSelectElement | any = document.querySelector('#type');
    
    weekTypeField.value = isWeekDay() ? STUDIO_SESSION_TYPE.WEEKDAY : STUDIO_SESSION_TYPE.WEEKEND
    if (startDateField && endDateField) {
        const startDate = isWeekDay() ? `${(new Date(Date.now() - timeZoneOffset)).toISOString().split('T')[0]}T09:00:00` : `${(new Date(Date.now() - timeZoneOffset)).toISOString().split('T')[0]}T10:00:00`;
        const endDate = isWeekDay() ? `${(new Date(Date.now() - timeZoneOffset)).toISOString().split('T')[0]}T20:00:00` : `${(new Date(Date.now() - timeZoneOffset)).toISOString().split('T')[0]}T22:00:00`
        startDateField.min = startDate;
        startDateField.defaultValue = startDate;
        endDateField.min = endDate;
        endDateField.defaultValue = endDate;
    }
    const dataForm: HTMLFormElement | any = document.querySelector('#create-session');
    
    dataForm.addEventListener('submit', submitForm);
   }
};
window.addEventListener(
    "DOMContentLoaded", loadCreateSession
  );