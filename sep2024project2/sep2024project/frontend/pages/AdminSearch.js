export default{
    template:`
    <div>
    <h1>Admin Search</h1>
    <select v-model="optionval">
    <option  hidden value='Select Header' > Select headers</option>
    <option value='date_of_register'>date_of_register</option>
    <option value='status'>status</option>
    </select>
    <span v-if="optionval=='date_of_register'">
    <input type="text"  placeholder="YYYY-MM-DD" v-model='searchData'>
    </span>
    <span v-else>
    <input type="text"  v-model='searchData'>
    </span>
    <div class="jumbotron">
     <table border="3px">
      <tr>
      <td>Request Id</td>
      <td>Service Provider Email</td>
      <td>Request Date</td>
      <td>Status</td>
      </tr>
      <tr v-for="dataval in admindata">
      <td>{{dataval["service_request"]["service_request_id"]}}</td>
      <td>{{dataval["user"]["email"]}}</td>
      <td>{{new Date(dataval["service_request"]["date_of_register"]).toLocaleString()}}</td>
      <td>{{dataval["service_request"]["service_status"]}}</td>
      </tr>
      </table>
    </div>
    </div>

    `,
    data(){
        return{
            admindata:[],
            optionval:"Select Header",
            searchData: ""
        }
    },
    watch: {
        searchData: {
            handler: async function () {
                try {
                    const res = await fetch(`${location.origin}/api/createserviceregister`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Token': this.$store.state.auth_token
                        },
                        body: JSON.stringify({
                            customer_id: "",
                            searchtearm: this.optionval,
                            searchvalue: this.searchData
                        })
                    });
                    this.admindata=await res.json()
                } catch (error) {
                    console.error('Error with fetch request:', error);
                }
            },
            immediate: true ,
        }
    },
}