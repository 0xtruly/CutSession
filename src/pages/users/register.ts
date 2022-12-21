import GlobalView, {NavProps} from "../global-view";
import axios from "axios";
import {API_BASE_URL} from "../../../config";
import axiosInstance from "../../utils/axiosInstance";
import { UserSignupDto, ACCESS_TYPE } from '../../../types';

// type MerchantSignUpDto = {
//     name: string;
//     email: string;
//     cityOfOperation: string;
//     username: string;
//     password: string;
//     phoneNumber: string;
//     metadata?: Record<string, string>
// }

export default class UserSignUp extends GlobalView {
    constructor(params: any) {
        super(params);
        this.setTitle("Register | Merchant")
    }

    async renderHtml() {
        return `
        ${this.navBar()}
        <main id="home" class="flex items-center justify-center h-screen">
            <div class="relative pt-28 mx-auto">
                <div class="bg-white shadow-md rounded px-12 py-12 mb-8">
                    <h1 class="text-2xl font-semibold text-gray-900">Create a user account</h1>

                    <form class="block text-sm" id="user-signup">
                        <div>
                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="name">Name</label>
                                <input name="name" data-name id="name" type="text" placeholder="Enter name" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>

                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="email">Email</label>
                                <input name="email" data-email id="email" type="text" placeholder="johndoe@example.com" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>

                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="username">UserName</label>
                                <input name="username" data-username id="username" type="text" placeholder="johndoe" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>

                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="cityOfOperation">City</label>
                                <input name="cityOfOperation" data-cityofoperation id="cityOfOperation" type="text" placeholder="Lagos" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>

                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="dob">D.O.B</label>
                                <input name="dob" data-dob id="dob" type="date" placeholder="D.O.B" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>

                            <div class="mt-6">
                                <label class="block text-gray-700 font-medium" for="phoneNumber">Phone Number</label>
                                <input name="phoneNumber" data-phonenumber id="phoneNumber" type="text" placeholder="2348123456789" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>
                            
                            <div class="relative mt-6">
                                <div class="absolute bottom-0.5 right-0 flex items-center px-2">
                                    <input class="hidden password-toggle" id="signup-password-toggle" type="checkbox" data-password-toggle />
                                    <label class="bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer toggle-password-label" for="signup-password-toggle">show</label>
                                </div>
                                <label class="inline-block text-gray-700 font-medium" for="password">Password</label>
                                <input name="password" data-password id="password" type="password" placeholder="Enter password" class="text-base border w-full h-5 px-4 py-4 mt-2 hover:outline-none focus:outline-none focus:ring focus:ring-offset-2 focus:ring-green-900 focus:ring-opacity-50 rounded">
                            </div>

                            <div class="inline-flex items-center mt-6">
                                <span class="text-gray-500 ml-2">Already have an account?</span> <a href="/user/login">Login</a>
                            </div>
                        </div>
                          <button type="submit" class="group relative flex w-full justify-center rounded-md border border-transparent bg-slate-700 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                              <svg class="h-5 w-5 text-slate-500 group-hover:text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clip-rule="evenodd" />
                              </svg>
                            </span>
                            Sign up
                        </button>

                    </form>
                </div>
            </div>
        </main>
        `
    }

}

const handleSignup = async (params: UserSignupDto | Record<string, string>) => {
    const options = {
        method: "POST",
        url: `/register/users`,
        headers: {'Content-Type': 'application/json', Prefer: 'code=200, dynamic=true'},
        data: {
            ...params
        }
    }
    try {
        const request = await axiosInstance.request(options)
        if (request.status === 200) {
            window.location.href = "/user/login"
        }
    } catch (error) {
        console.log("error", error.message)
    }
}

const submitForm = async (e) => {
    e.preventDefault();
    const formEl = e.target;
    var formData = new FormData(formEl);
    let params: UserSignupDto | Record<string, string> = {}
    for (const item of formData.entries()) {
        params[item[0]] = item[1] as string
    }
    await handleSignup(params)
}

document.body.addEventListener('submit', async (e) => {
    if (e && (e.target as HTMLButtonElement).id === 'user-signup') {
        await submitForm(e)
    }
})

window.addEventListener('change', async (e) => {
    if (e && (e.target as HTMLInputElement).id === 'signup-password-toggle' && (e.target as HTMLInputElement).type === 'checkbox') {
        const password: any = document.querySelector('input[data-password]'),
        passwordLabel: any = document.querySelector('.toggle-password-label')
        if (password.type === 'password') {
            password.type = 'text'
            passwordLabel.innerHTML = 'hide'
          } else {
            password.type = 'password'
            passwordLabel.innerHTML = 'show'
          }
        
          password.focus()
    }
})