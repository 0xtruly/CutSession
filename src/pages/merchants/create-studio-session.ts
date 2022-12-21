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

    protectedLink: NavProps[] = [
        {
            url: '/merchant/dashboard',
            title: 'My Sessions'
        },
    ]

    async renderHtml() {
        return `
        ${this.navBar()}
        <main id="home" class="flex items-center h-screen">
            <div class="relative pt-28 mx-auto">
                <div class="bg-white shadow-md rounded px-12 py-12 ">
                    <h1 class="text-2xl font-semibold text-gray-900">Create a Studio Session</h1>

                    <form class="block text-sm" id="create-session">
                        <div>
                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="type">Type</label>
                                <select name="type" data-type id="type" class="text-sm border w-full px-2 py-2  focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded text-gray-900">
                                    <option value="WeekDay">WeekDay</option>
                                    <option value="WeekEnd">WeekEnd</option>
                                </select>
                            </div>
                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="timeSlot">Time Slot</label>
                                <select name="timeSlot" data-timeslot id="timeSlot" class="text-sm border w-full px-2 py-2  focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded text-gray-900">
                                    <option value="40">40 mins</option>
                                    <option value="60">60 mins</option>
                                    <option value="90">90 mins</option>
                                </select>
                            </div>
                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="startsAt">Starts At (pick a time slot between 09:00-20:00)</label>
                                <input name="startsAt" data-startsat id="startsAt" type="datetime-local"  class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>
                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="endsAt">Ends At</label>
                                <input name="endsAt" data-endsat id="endsAt" type="datetime-local" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>
                        </div>
                          <button id="create-session-btn" type="submit" class="group relative flex w-full justify-center rounded-md border border-transparent bg-slate-700 py-2 px-4 text-sm font-medium text-white enabled:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4 disabled:opacity-75">
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
    delete(params.timeSlot)
    const data = {
        ...params,
        startsAt: formatTime(params.startsAt),
        endsAt: formatTime(params.endsAt),
    }
    const merchantId = (user && user.merchantId.length >= 15) ? user.merchantId : "6cbfba82-c0f9-4a28-e093-ae93ea99a070"
    await handleCreateSession(data, merchantId);
}


const isWeekDay = (date: string): boolean => {
    const weekDay = !!date ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(date).getDay()]
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(weekDay)
}

const getEndTime = (date: string, durationInMins: number) => {
    let hoursFromDuration: number = durationInMins >= 60 ? Math.trunc(durationInMins / 60) : 0;
    let minutesFromDuration: number = durationInMins % 60;
    
    let minute: number = new Date(date).getMinutes();
    let hours: number = new Date(date).getHours() + hoursFromDuration + Math.trunc(minute / 60);
    minutesFromDuration =  minute % 60 + minutesFromDuration;

    hours = hours >= 10 ? hours : hours.toString().padStart(2, '0');
    minutesFromDuration = minutesFromDuration >= 10 ? minutesFromDuration : minutesFromDuration.toString().padStart(2, '0');
    return minutesFromDuration === 0 ? `${hours}:00` : `${hours}:${minutesFromDuration}`
}

const getEndDate = (date: string) => {
    const unixTmp = Math.floor(new Date(date).getTime());
    return new Date(unixTmp - timeZoneOffset).toISOString().split('T')[0]
}

const loadCreateSession = async() => {
   if (window.location.pathname === '/session/create') {
    let startDateField: HTMLInputElement | any = document.querySelector('#startsAt'),
    timeSlotField: HTMLSelectElement | any = document.querySelector('#timeSlot'),
    endDateField: HTMLInputElement | any = document.querySelector('#endsAt'),
    weekendTypeField: HTMLSelectElement | any = document.querySelector('#type');
    weekendTypeField.value = isWeekDay() ? STUDIO_SESSION_TYPE.WEEKDAY : STUDIO_SESSION_TYPE.WEEKEND;
    const startDate = isWeekDay() ? `${(new Date(Date.now() - timeZoneOffset)).toISOString().split('T')[0]}T09:00` : `${(new Date(Date.now() - timeZoneOffset)).toISOString().split('T')[0]}T10:00`;
    startDateField.min = startDate;
    startDateField.defaultValue = startDate;
    const endTime = getEndTime(startDate, Number(timeSlotField.value));
    const endDate = getEndDate(startDate)
    endDateField.defaultValue = `${endDate}T${endTime}`
   }
};

document.body.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (e && (e.target as HTMLButtonElement).id === 'create-session') {
        let startDateField: HTMLInputElement | any = document.querySelector('#startsAt'),
    startDateLabel: HTMLLabelElement | any = document.querySelector('label[for=startsAt]'),
    formButton: HTMLButtonElement | any = document.querySelector('#create-session-btn'),
    timeSlotField: HTMLSelectElement | any = document.querySelector('#timeSlot'),
    endDateField: HTMLInputElement | any = document.querySelector('#endsAt'),
    weekendTypeField: HTMLSelectElement | any = document.querySelector('#type');
    const endTime = getEndTime(endDateField.value, Number(timeSlotField.value));
    const endDate = getEndDate(endDateField.value)
    let minute: number = new Date(startDateField.value).getMinutes();
    let hours: number = new Date(startDateField.value).getHours();
    hours = hours >= 10 ? hours : hours.toString().padStart(2, '0');
    minute = minute >= 10 ? minute : minute.toString().padStart(2, '0');
    const startTime = `${hours}:${minute}`;
    if ((weekendTypeField.value === STUDIO_SESSION_TYPE.WEEKDAY) && ((startTime < "09:00") || endTime > "20:00")) {
        if (startTime < "09:00") {
            startDateField.classList.add('border-2', 'border-red-700', 'animate-pulse')
        }

        if (endTime > "20:00") {
            endDateField.classList.add('border-2', 'border-red-700', 'animate-pulse')
        }
    } else {
        startDateField.classList.remove('border-2', 'border-red-700', 'animate-pulse')
        endDateField.classList.remove('border-2', 'border-red-700', 'animate-pulse')
        await submitForm(e)
    }

    if ((weekendTypeField.value === STUDIO_SESSION_TYPE.WEEKEND) && (startTime < "10:00" || endTime > "22:00")) {
        if (startTime < "10:00") {
            startDateField.classList.add('border-2', 'border-red-700', 'animate-pulse')
        }

        if (endTime > "22:00") {
            endDateField.classList.add('border-2', 'border-red-700', 'animate-pulse')
        }
    } else {
        startDateField.classList.remove('border-2', 'border-red-700', 'animate-pulse')
        endDateField.classList.remove('border-2', 'border-red-700', 'animate-pulse')
        await submitForm(e)
    }
      
    }
})


document.body.addEventListener('change', async (e) => {
    let startDateField: HTMLInputElement | any = document.querySelector('#startsAt'),
    startDateLabel: HTMLLabelElement | any = document.querySelector('label[for=startsAt]'),
    formButton: HTMLButtonElement | any = document.querySelector('#search-session-btn'),
    timeSlotField: HTMLSelectElement | any = document.querySelector('#timeSlot'),
    endDateField: HTMLInputElement | any = document.querySelector('#endsAt');
    if (e && (e.target as HTMLInputElement).id === 'type') {
        if (e.target.value === STUDIO_SESSION_TYPE.WEEKDAY) {
            const startDate = `${(new Date(Date.now() - timeZoneOffset)).toISOString().split('T')[0]}T09:00`;
            startDateField.min = startDate;
            startDateField.defaultValue = startDate;
            startDateLabel.textContent = "Starts At (intervals can be between 09:00-20:00)"

            const endTime = getEndTime(startDate, Number(timeSlotField.value));
            const endDate = getEndDate(startDate)
            endDateField.defaultValue = `${endDate}T${endTime}`
        } else {
            const startDate = `${(new Date(Date.now() - timeZoneOffset)).toISOString().split('T')[0]}T10:00`;
            startDateField.min = startDate;
            startDateField.defaultValue = startDate;
            startDateLabel.textContent = "Starts At (intervals can be between 10:00-22:00)"

            const endTime = getEndTime(startDate, Number(timeSlotField.value));
            const endDate = getEndDate(startDate)
            endDateField.defaultValue = `${endDate}T${endTime}`
        }
    }
    if (e && (e.target as HTMLInputElement).id === 'startsAt') {
        const endTime = getEndTime(e.target.value, Number(timeSlotField.value));
        const endDate = getEndDate(e.target.value)
        endDateField.value = `${endDate}T${endTime}`
    }
    
    if (e && (e.target as HTMLInputElement).id === 'timeSlot') {
        const endTime = getEndTime(startDateField.value, Number(e.target.value));
        const endDate = getEndDate(startDateField.value)
        endDateField.defaultValue = `${endDate}T${endTime}`
    }
    // endDateField.disabled = true;
  })

window.addEventListener(
    "DOMContentLoaded", loadCreateSession
  );