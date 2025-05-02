import Home from '../pages/home/home';
import {checkAuthenticatedRoute, checkUnauthenticatedRouteOnly} from "../utils/auth";
import Login from "../pages/auth/login/login";
import Register from "../pages/auth/register/register";
import AddStory from "../pages/add/AddStory";
import Detail from "../pages/detail/detail";
import Saved from "../pages/Saved/Saved";
import NotFound from "../pages/error/404";

const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new Login()),
  '/register': () => checkUnauthenticatedRouteOnly(new Register()),

  '/': () => checkAuthenticatedRoute(new Home()),
  '/new': () => checkAuthenticatedRoute(new AddStory()),
  '/story/:id': () => checkAuthenticatedRoute(new Detail()),
  '/bookmark': () => checkAuthenticatedRoute(new Saved()),
  '*': () => checkAuthenticatedRoute(new NotFound()),
};

export default routes;