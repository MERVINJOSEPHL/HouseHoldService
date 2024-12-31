import ServiceProvider from "../components/ServiceProvider.js"
export default{
    template:`
    <div>
    <h1>User Search</h1>
    <select v-model="optionval">
    <option  hidden value='Select Header' > Select headers</option>
    <option value='PINCode'>Pin Code</option>
    </select>
    <input type="text" v-model='searchData'>
    <div class="p-4" >
    <ServiceProvider :specifiedservice="specificservices" :servicebooking="ServiceBooking" :headerval="headerval"/>
    </div>
    </div>

    `,
    data(){
        return{
            specificservices:[],
            optionval:"Select Header",
            searchData: "",
            headerval:false
        }
    },
    watch: {
        searchData: {
            handler: async function () {
                try {
                    let searchbody=this.optionval
                    if(this.optionval=="Select Header"){
                        searchbody="PINCode"
                    }
                        const res = await fetch(location.origin + '/api/getspecificservices', { method: 'PUT',
                            headers: {'Content-Type' : 'application/json','Access-Token': this.$store.state.auth_token}, 
                            body : JSON.stringify({"searchTearm":searchbody,"searchValue":this.searchData}) })
                        let result=await res.json()
                        if(result.length==0){
                            alert("No Service Provider")
                        }
                        this.specificservices=result
                } catch (error) {
                    console.error('Error with fetch request:', error);
                }
            },
            immediate: true ,
        }
    },
    methods:{
        async ServiceBooking(id,servicename,custid) {
            const res = await fetch(location.origin + '/api/createserviceregister', { method: 'POST',
                headers: {'Content-Type' : 'application/json','Access-Token': this.$store.state.auth_token}, 
                body : JSON.stringify({serviceProviderId:id,
                    customer_id:custid,
                    service_name:servicename
                }) })
        },
    },
    components:{
        ServiceProvider
    }
}