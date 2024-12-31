const Home = {
    template : `<h1> this is home </h1>`
}
export default {
    template : `
    <div>
        <router-link class="btn btn-secondary" to='/' v-if="!$store.state.loggedIn">Home</router-link>
        <router-link  class="btn btn-secondary" to='/register' v-if="!$store.state.loggedIn">Register</router-link>
        <router-link class="btn btn-secondary" to='/login' v-if="!$store.state.loggedIn">Login</router-link>
        <router-link  class="btn btn-primary" to='/userdashboard' v-if="$store.state.loggedIn && $store.state.role == 'user'" >Dash Board</router-link>
        <router-link  class="btn btn-primary" to='/usersearch' v-if="$store.state.loggedIn && $store.state.role == 'user'" >Search</router-link>
        <router-link   class="btn btn-primary" to='/customer-summary' v-if="$store.state.loggedIn && $store.state.role == 'user'" >Summary</router-link>
        <router-link  class="btn btn-primary" to='/servicedashboard' v-if="$store.state.loggedIn && $store.state.role == 'serviceprovider'" >Dash Board</router-link>
        <router-link  class="btn btn-primary" to='/servicesearch' v-if="$store.state.loggedIn && $store.state.role == 'serviceprovider'" >Search</router-link>
        <router-link   class="btn btn-primary" to='/provider-summary' v-if="$store.state.loggedIn && $store.state.role == 'serviceprovider'" >Summary</router-link>
        <router-link  class="btn btn-primary" to='/admindashboard' v-if="$store.state.loggedIn && $store.state.role == 'admin'" >Dash Board</router-link>
        <router-link   class="btn btn-primary" to='/adminsearch' v-if="$store.state.loggedIn && $store.state.role == 'admin'" >Search</router-link>
        <router-link   class="btn btn-primary" to='/summary' v-if="$store.state.loggedIn && $store.state.role == 'admin'" >Summary</router-link>
        <button class="btn btn-secondary" v-if="$store.state.loggedIn" @click="$store.commit('logout')"><router-link  to='/login' v-if="$store.state.loggedIn " >Logout</router-link></button>
    </div>
    `
}