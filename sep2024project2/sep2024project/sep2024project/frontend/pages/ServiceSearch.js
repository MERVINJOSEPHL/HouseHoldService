import CustomerDetails from "../components/CustomerDetails.js"
export default{
    template:`
    <div>
    Welcome Service Provider
    <div class="p-4"  >
    <h1>Server Search</h1>
    <select v-model="optionval">
    <option  hidden value='Select Header' > Select headers</option>
    <option value='pincode'>Pin Code</option>
    <option value='date_of_register'>Register Date</option>
    <option value='email'>Email</option>
    </select>
    <input type="text" v-if="optionval!='date_of_register'" v-model='searchData'>
    <input type="text" v-else placeholder="YYYY-MM-DD" v-model='searchData'>
    <CustomerDetails :UserHistory="UserHistorys" :status="'approved'"/>
   </div>

    </div>`,
    data(){
        return({UserHistorys:[],
            optionval:"Select Header",
            searchData: "",})
    },
    mounted(){
        this.createServiceRegister()
    },
    watch: {
        searchData: {
            handler: async function () {
                console.log("i came when search")
                try {
                    let searchbody=this.optionval
                    if(this.optionval=="Select Header"){
                        searchbody='pincode'
                    }
                        const res = await fetch(location.origin + '/api/createserviceregister', { method: 'Delete',
                            headers: {'Content-Type' : 'application/json','Access-Token': this.$store.state.auth_token}, 
                            body : JSON.stringify({"searchtearm":searchbody,"searchvalue":this.searchData,"serviceProviderId":this.$store.state.user_id}) })
                        let result=await res.json()
                        if(result.length==0){
                            alert("No Service Provider")
                        }
                        console.log(result)
                        this.UserHistorys=result
                } catch (error) {
                    console.error('Error with fetch request:', error);
                }
            },
            immediate: true ,
        }
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
      
    },
    components:{
        CustomerDetails,
    }
}