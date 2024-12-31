import BarChart from "../components/BarChart.js";
export default {
    template : `
    <div>
    <div class="row row-cols-1 row-cols-md-2 g-4" style="margin-left:4%;margin-top:2%;height:300px;width: 48%;float:left;">
    <BarChart :dataval='dataval' :type="'bar'" :labels="['completed','pending','rejected']" :backgroundColor="['Green','Yellow','Red']" ></BarChart>
    </div>
    <div class="row row-cols-1 row-cols-md-2 g-4" style="width: 48%;" >
    <BarChart :dataval='customerratingval' :type="'pie'" :labels="['1 Stars','2 Stars','3 Stars','4 Stars','5 Stars']" :backgroundColor="['Red','Blue','Yellow','Green','Orange']" :datasetlabel="'Summary of Customer Rating '"></BarChart>
    </div>
    </div>
    `,
    data(){
        return {
            dataval : [0, 0, 0],
            customerratingval:[0,0,0,0,0]
        } 
    },
    async mounted() {
        await this.createServiceRegister();
    },
   
    
    methods: {
        async createServiceRegister(){
            const res = await fetch(location.origin + '/api/createserviceregister', { method: 'Delete',
                headers: {'Content-Type' : 'application/json','Access-Token': this.$store.state.auth_token}, 
                body : JSON.stringify({'serviceProviderId': this.$store.state.user_id }) })
                let result=await res.json()
                let admindata=result
            let customerratingupdate=[0,0,0,0,0]
            let sampledataval=[0,0,0]
            admindata.forEach(data=> {
                console.log(data.service_request);
                if (data.service_request.remarks) {
                    console.log(data.service_request.remarks);
                    // Temporarily store the updated value outside of reactivity
                    console.log(customerratingupdate[Number(data.service_request.remarks)])
                    customerratingupdate[Number(data.service_request.remarks)-1] += 1;
                    
                }
                if(data.service_request.service_status=='pending'){
                    sampledataval[1]+=1
                }
                else if(data.service_request.service_status=='rejected'){
                    sampledataval[2]+=1
                }
                else if(data.service_request.service_status=='completed'){
                    sampledataval[0]+=1
                }
            });
            console.log(customerratingupdate)
            this.customerratingval = customerratingupdate;
            this.dataval=sampledataval
            console.log(result.professionaldetails)
                console.log(result)

        },
        
       
          

    },
    components:{
        BarChart:BarChart,
    }

}