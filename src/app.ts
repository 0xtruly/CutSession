import ErrorPage from "./pages/errorpage";
import home from "./pages/home";
import CreateStudioSession from "./pages/merchants/create-studio-session";
import StudioSessions from "./pages/merchants/dashboard";
import MerchantSignUp from "./pages/merchants/register";
import MerchantLogin from "./pages/merchants/signin";
import SessionBooking from "./pages/users/book-session";
import MerchantList from "./pages/users/dashboard";
import UserSignUp from "./pages/users/register";
import UserLogin from "./pages/users/signin";
import MerchantStudioSessions from "./pages/users/studio-sessions";
import BookedSessions from "./pages/users/bookings"



type MatchProp = {
    route: {
        path: string;
        view: typeof home;
    };
    result: RegExpMatchArray | null;
}

const pathToRegex = (path: string) =>
  new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

const getParams = (match: MatchProp) => {
  const values = (match.result as RegExpMatchArray).slice(1);

  const keys = Array.from(
    match.route.path
      .matchAll(/:(\w+)/g))
      .map(result => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [
        key,
        values[i]
      ];
    })
  );
};

const navigateTo = url => {
  history.pushState(null, "", url);
  router();
};

const router = async () => {
    const routes = [
        { path: '/', view: home }, 
        { path: '/merchant/signup', view: MerchantSignUp }, 
        { path: '/merchant/login', view: MerchantLogin }, 
        { path: '/user/signup', view: UserSignUp }, 
        { path: '/user/login', view: UserLogin },
        { path: '/user/dashboard', view: MerchantList },
        { path: '/merchant/dashboard', view: StudioSessions },
        { path: '/session/create', view: CreateStudioSession },
        { path: '/merchant/session/:id', view: MerchantStudioSessions },
        { path: '/session/book/:id', view: SessionBooking },
        { path: '/session/bookings', view: BookedSessions },
    ];

    // Test each route for a potential match.
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: { path: '*', view: ErrorPage },
            result: [
                location.pathname
            ]
        };
    }

    const view = new match.route.view(getParams(match));
    const app = document.querySelector('#root')
    if (app) {
        app.innerHTML = await view.renderHtml();
    }
};

window.addEventListener('popstate', router);

let url = location.href;

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', e => {
        requestAnimationFrame(() => {
            if (url !== location.href) {
                url = location.href
            }
            let dataLink = (e.target as HTMLAnchorElement).matches('[data-link]')
            let link = (e.target as HTMLAnchorElement).href
            if (dataLink && link) {
                e.preventDefault();
                navigateTo(link);
            }
        });
    });



    router();
}, true);