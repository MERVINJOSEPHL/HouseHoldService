
import CustomerDetails from "../components/CustomerDetails.js"
export default{
    template:`
    <div>
    Welcome Service Provider
    <div class="p-4"  >
    <CustomerDetails :UserHistory="UserHistorys" :approvalOrRejected="approvalOrRejected" :status="'pending'"/>

    History:
    <CustomerDetails :UserHistory="UserHistorys" :approvalOrRejected="approvalOrRejected" :status="'approved'"/>
   </div>

    </div>`,
    data(){
        return({UserHistorys:[]})
    },
    mounted(){
        this.createServiceRegister()
    },
    methods: {
        async createServiceRegister(){
            const res = await fetch(location.origin + '/api/createserviceregister', { method: 'Delete',
                headers: {'Content-Type' : 'application/json','Access-Token': this.$store.state.auth_token}, 
                body : JSON.stringify({'serviceProviderId': this.$store.state.user_id }) })
                let result=await res.json()
                this.UserHistorys=result
                console.log(result)

        },
        async approvalOrRejected(service_request_id,approval){
            const res = await fetch(location.origin + '/api/createserviceregister', { method: 'PUT',
                headers: {'Content-Type' : 'application/json','Access-Token': this.$store.state.auth_token}, 
                body : JSON.stringify({'action':'serviceproviderapproval','service_request_id': service_request_id,'approval':approval }) })
                this.createServiceRegister()

        },
    },
    components:{
        CustomerDetails,
    }

}