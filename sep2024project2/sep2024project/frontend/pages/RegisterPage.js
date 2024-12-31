import UserRegister from "../pages/UserRegister.js"
import ServiceRegister from "../pages/ServiceRegister.js"
export default {
    template : `
    <div>
        <ul  style="list-style-type: none;">
        <li style="float:left;margin-right:10px;margin-left:-50px" class="btn btn-primary" @click="dataval = 'userregister'">User Register    </li>
        <li class="btn btn-primary" @click="dataval = 'serviceregister'">  Service Register</li> 
        </ul>
        <div v-if="dataval=='userregister'">
        <UserRegister></UserRegister>
        </div>
        <div v-if="dataval=='serviceregister'">
        <ServiceRegister :services="services"></ServiceRegister>
        </div> 
    </div>
    `,
    data(){
        return {
            dataval : null,
            services:[],
        } 
    },
    components:{
        UserRegister,
        ServiceRegister
    },
    async mounted() {
        await this.function1();
    },
    methods: {
        async function1() {
            const res = await fetch(location.origin + '/api/getallservices', { method: 'GET','Access-Token': this.$store.state.auth_token })
            const data=await res.json()
            this.services=data
            
        
        }
    }

}