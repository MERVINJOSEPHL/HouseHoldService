
export default{
    props:["specifiedservice","servicebooking","headerval"],
    template:`<div>
    <h1>Service Providers</h1>
    <div v-if="specifiedservice.length!=0">
    <h4 v-if="headerval">Service Name:{{specifiedservice[0]["services"]["service_name"]}}</h4>
    <div class="jumbotron">
    <table border="3px">
    <tr>
    <th>
    Service Provider Name
    </th>
    <th>
    Service Provider Experience
    </th>
    <th>
    Pincode
    </th>
    <th>
    Service Name
    </th>
    </tr>
    <tr v-for="data in specifiedservice">
    <td>{{data["user"]['fullname']}}</td>
    <td>{{data["user"]['service_provider_experience']}}</td>
    <td>{{data["user"]['pincode']}}</td>
    <td v-if="headerval"><button @click="servicebooking(data['user']['userid'],data['user']['service_name'],$store.state.user_id)">BOOK</button></td>
    <td v-else>{{data["user"]["service_name"]}}</td>
    </tr>

    </table>
    </div>
    </div>
    
    </div>`
}