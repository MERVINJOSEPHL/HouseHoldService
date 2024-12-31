import ServiceCard from "../components/ServiceCard.js"
import UserHistory from "../components/UserHistory.js"
import ServiceProvider from "../components/ServiceProvider.js"
import FeedbackCard from "../components/feedbackCard.js"
export default{
    template:`
    <div>
    <div v-if="feedbackval==true">
    <h1>Welcome User</h1>
    <div class="p-4"  v-if="specificservices.length==0">
    <h1> Looking For ?</h1>
    <div class="row row-cols-1 row-cols-md-2 g-4" >
    <ServiceCard v-for="service in services" :title="service.service_name" :description="service.description" :baseprice="service.base_price" :service_id="service.service_id" :getspecificservices="getspecificservices"/>
    </div>
    </div>
    <div class="p-4"  v-else>
    <ServiceProvider :specifiedservice="specificservices" :servicebooking="ServiceBooking" :headerval="headerval"/>
    <button @click="specificservices=[]">Cancel</button>
    </div>
    
    <h1> History !!</h1>
    <UserHistory :history="UserHistorys" :feedback="feedback"/>
   </div>
   <div v-else-if="feedbackval==false">
    <FeedbackCard :data="data" :feedback="feedback"></FeedbackCard>
   </div>
    </div>`,
    data(){
        return({services:[],UserHistorys:[],specificservices:[],headerval:true,feedbackval:true,data:[]})
    },
    mounted(){
        this.getallservices(),
        this.createServiceRegister()
    },
    methods: {
        async feedback(val){
            this.data=val;
            this.feedbackval=!this.feedbackval
            this.createServiceRegister()
        },
        async getallservices() {
            const res = await fetch(location.origin + '/api/getallservices', { method: 'GET','Access-Token': this.$store.state.auth_token })
            let result=await res.json()
            this.services=result
        },
        async createServiceRegister(){
            const res = await fetch(location.origin + '/api/createserviceregister', { method: 'Delete',
                headers: {'Content-Type' : 'application/json','Access-Token': this.$store.state.auth_token}, 
                body : JSON.stringify({'customer_id': this.$store.state.user_id }) })
            this.UserHistorys=await res.json()
        },
        async getspecificservices(id) {
            const res = await fetch(location.origin + '/api/getspecificservices', { method: 'PUT',
                headers: {'Content-Type' : 'application/json','Access-Token': this.$store.state.auth_token}, 
                body : JSON.stringify({"searchTearm":"ServiceID","searchValue":id }) })
            let result=await res.json()
            if(result.length==0){
                alert("No Service Provider")
            }
            this.specificservices=result
        },
        async ServiceBooking(id,servicename,custid) {
            const res = await fetch(location.origin + '/api/createserviceregister', { method: 'POST',
                headers: {'Content-Type' : 'application/json','Access-Token': this.$store.state.auth_token}, 
                body : JSON.stringify({serviceProviderId:id,
                    customer_id:custid,
                    service_name:servicename
                }) })
            this.specificservices=[]
            this.createServiceRegister()
        },
    },
    components:{
        ServiceCard,
        UserHistory,
        ServiceProvider,
        FeedbackCard
    }

}