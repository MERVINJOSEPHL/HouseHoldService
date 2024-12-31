const Home = {
    template : `
    <div>
    <img src="https://rbsland.com/wp-content/uploads/2021/11/services.jpg" width="1280px" height="500px" alt="Services Image"/>
    <h1>Welcome To MJ House Hold Services</h1>
    </div>
    `
}
import AdminDashBoard from "../pages/AdminDashBoard.js";
import LoginPage from "../pages/LoginPage.js";
import NewService from "../pages/NewService.js";
import RegisterPage from "../pages/RegisterPage.js";
import AdminSearch from "../pages/AdminSearch.js";
import store from './store.js'
import UserDashBoard from "../pages/UserDashBoard.js";
import UserSearch from "../pages/UserSearch.js";
import ServiceDashBoard from "../pages/ServiceDashBoard.js";
import servicesearch from "../pages/ServiceSearch.js";
import AdminSummary from "../pages/AdminSummary.js";
import ServiceSummary from "../pages/ServiceSummary.js";
import CustomerSummary from "../pages/CustomerSummary.js";
const routes = [
    {path : '/', component : Home},
    {path : '/login', component : LoginPage},
    {path : '/register', component : RegisterPage},
    {path : '/userdashboard', component : UserDashBoard, meta : {requiresLogin : true,role:"user"}},
    {path : '/usersearch', component : UserSearch, meta : {requiresLogin : true,role:"user"}},
    {path : '/customer-summary', component : CustomerSummary, meta : {requiresLogin : true,role:"user"}},
    {path : '/servicedashboard', component : ServiceDashBoard, meta : {requiresLogin : true,role:"serviceprovider"}},
    {path : '/servicesearch', component : servicesearch, meta : {requiresLogin : true,role:"serviceprovider"}},   
    {path : '/provider-summary', component : ServiceSummary, meta : {requiresLogin : true,role:"serviceprovider"}}, 
    {path : '/admindashboard', component : AdminDashBoard, meta : {requiresLogin : true,role:"admin"}},
    {path : '/adminsearch', component : AdminSearch, meta : {requiresLogin : true,role:"admin"}},
    {path : '/newservice', component : NewService, meta : {requiresLogin : true,role:"admin"}},
    {path : '/summary', component : AdminSummary, meta : {requiresLogin : true,role:"admin"}},
]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    // console.log(to,from)
    if (to.matched.some((record) => record.meta.requiresLogin)){
        if (!store.state.loggedIn){
            next({path : '/login'})
        } else if (to.meta.role && to.meta.role != store.state.role){
            alert('role not authorized')
             next({path : '/'})
        } else {
            next();
        }
    } else {
        next();
    }
})
export default router;