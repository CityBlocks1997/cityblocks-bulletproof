import BrownstonePlayers from './pages/BrownstonePlayers';
import Home from './pages/Home';
import Customize from './pages/Customize';
import Directory from './pages/Directory';
import UserBrownstone from './pages/UserBrownstone';
import Terms from './pages/Terms';
import AdminDashboard from './pages/AdminDashboard';
import CommunityLibrary from './pages/CommunityLibrary';


export const PAGES = {
    "BrownstonePlayers": BrownstonePlayers,
    "Home": Home,
    "Customize": Customize,
    "Directory": Directory,
    "UserBrownstone": UserBrownstone,
    "Terms": Terms,
    "AdminDashboard": AdminDashboard,
    "CommunityLibrary": CommunityLibrary,
}

export const pagesConfig = {
    mainPage: "BrownstonePlayers",
    Pages: PAGES,
};