export default {
    template : `
    <div>
    <div class="jumbotron">
      <h1>Services</h1>
      <table border="3px">
      <tr>
      <td>Service Id</td>
      <td>Service Name</td>
      <td>Base Price</td>
      <td>Description</td>
      <td>Action</td>
      </tr>
      <tr v-for="dataval in admindata.services">
      <td>{{dataval["service_id"]}}</td>
      <td>{{dataval["service_name"]}}</td>
      <td>{{dataval["base_price"]}}</td>
      <td>{{dataval["description"]}}</td>
      <td><span class="text-primary" @click="$router.push({ path: '/newservice', query: { service_details: dataval }})">Edit</span> / <span class="text-primary" @click='handleDeleteServices(dataval.service_id)'>Delete</span></td>

      </tr>
      </table>
      <h2 class="text-primary" @click="$router.push('/newservice')">+ New Service</h2>
    </div>
    <div class="jumbotron">
    <h1>Service Professional</h1>
      <table border="3px">
      <tr>
      <td>Id</td>
      <td>Name</td>
      <td>Experience (YRS)</td>
      <td>ServiceName</td>
      <td>Action</td>
      </tr>
      <tr v-for="dataval in admindata.professionaldetails">
      <td>{{dataval["userid"]}}</td>
      <td>{{dataval["user_name"]}}</td>
      <td>{{dataval["service_provider_experience"]}}
      <td>{{dataval["service_name"]}}</td>
      <td v-if="dataval.active== 'False'" class="text-danger">Rejected</td>
      <td v-else-if="dataval.isVerified== 'True'" class="text-warning">Approved</td>
      <td v-else ><span class="text-primary" @click="ApproveOrRejectServicer(dataval['userid'],'True')">Approve</span>/<span class="text-primary" @click="ApproveOrRejectServicer(dataval['userid'],'False')">Reject</span></td>

      </tr>
      </table>
    </div>
    <div class="jumbotron">
    <h1>Service Request</h1>
      <table border="3px">
      <tr>
      <td>Request Id</td>
      <td>Service Provider Id</td>
      <td>Request Date</td>
      <td >Completion Date</td>
      <td>Status</td>
      </tr>
      <tr v-for="dataval in admindata.servicerequestdata">
      <td>{{dataval["service_request_id"]}}</td>
      <td>{{dataval["service_provider_id"]}}</td>
      <td>{{new Date(dataval["date_of_register"]).toLocaleString()}}</td>
      <td>{{ dataval["date_of_completion"] ? new Date(dataval["date_of_completion"]).toLocaleString() : "-" }}</td>
      <td class="text-primary" v-if="dataval['service_status']=='completed'">{{dataval["service_status"]}}</td>
      <td class="text-warning" v-if="dataval['service_status']=='pending'">{{dataval["service_status"]}}</td>
      <td class="text-danger" v-if="dataval['service_status']=='rejected'">{{dataval["service_status"]}}</td>
      </tr>
      </table>
      <span class="text-primary" @click="batchprocess()">+ Export Data</span>
    </div>
   
    <div id="app">
    <canvas ref="myChart"></canvas>
  </div>
    </div>
    `,
    data(){
        return {
            dataval : null,
            loading:true,
            admindata:[
                {
                professionaldetails:[],

                }
            ],
        } 
    },
    async mounted() {
        await this.function1();
        

    },
   
    
    methods: {
        async function1() {
            const res = await fetch(location.origin + '/api/newservices', { method: 'GET',
              headers: {
                'Access-Token': this.$store.state.auth_token
              } 

             })
            let result=await res.json()
            this.admindata=result
            console.log(result.professionaldetails)
        },
        async handleDeleteServices(service_id) {
            try {
              const res = await fetch(`${location.origin}/api/newservices`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Token': this.$store.state.auth_token
                },
                body: JSON.stringify({ service_id })
              });
          
              if (res.ok) {
                const data = await res.json();
                console.log('Service deleted:', data);
                this.admindata.services = this.admindata.services.filter(service => service.service_id !== service_id);
              } else {
                const errorData = await res.json();
                console.error('Error deleting service:', errorData.error);
              }
            } catch (error) {
              console.error('Request failed:', error);
            }
          },
          async ApproveOrRejectServicer(service_register_id,verification) {
              const res = await fetch(`${location.origin}/api/newservices`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Token': this.$store.state.auth_token
                },
                body: JSON.stringify({ service_id:"",service_professionalId:service_register_id,isVerified:verification})
                
              });
              const serviceToUpdate = this.admindata.professionaldetails.find(professionaldetails =>professionaldetails.userid == service_register_id);
                if (serviceToUpdate) {
                    serviceToUpdate.isVerified = verification
                    serviceToUpdate.active=verification
                    console.log(serviceToUpdate)
                  }
                  console.log(serviceToUpdate,"out")
          },
          async batchprocess(){
            const res = await fetch(location.origin + '/create-csv',{headers: {
              'Access-Token': this.$store.state.auth_token
            } })
            const task_id = (await res.json()).task_id

            const interval = setInterval(async() => {
                const res = await fetch(`${location.origin}/get-csv/${task_id}`)
                if (res.ok){
                    console.log('data is ready')
                    window.open(`${location.origin}/get-csv/${task_id}`)
                    clearInterval(interval)
                }

            }, 100)

          }
          

    }

}
