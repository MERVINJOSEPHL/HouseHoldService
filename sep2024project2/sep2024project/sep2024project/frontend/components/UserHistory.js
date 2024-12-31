export default{
    props:["history","feedback"],
    template:`
    <table class="table table-striped">
        <tr>
        <th>ID</th>
        <th>Service Name</th>
        <th>Professional Name</th>
        <th>Email</th>
        <th>Status</th>
        </tr>
        <tr>
        <tr v-if="history.length!=0" v-for="val in history">
        <td>{{val["service_request"]["service_request_id"]}}</td>
        <td>{{val["user"]["service_name"]}}</td>
        <td>{{val["user"]["user_name"]}}</td>
        <td>{{val["user"]["email"]}}</td>
        <td v-if="val['service_request']['service_status']=='pending'" class="text-primary">Requested</td>
        <td v-else-if="val['service_request']['service_status']=='rejected'" class="text-danger">Rejected</td>
        <td v-else-if="val['service_request']['service_status']=='completed'" class="text-primary"> Closed </td>
        <td v-else-if="val['service_request']['service_status']=='approved'"><button class="btn btn-warning" @click="feedback(val)"> Close </button></td>
        </tr>
        <tr v-if="history.length==0">
        <td colspan="5" align="center">No Records Found</td>
        </tr>
        </table>
        `
}