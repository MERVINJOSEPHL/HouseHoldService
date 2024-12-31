export default{
    props:['UserHistory','approvalOrRejected','status'],

    template:`
    <div>
    <table border="3px">
    <tr>
    <th>
    Service ID
    </th>
    <th>
    Customer Name
    </th>
    <th>
    Customer Mail
    </th>
    <th>
    Location(with pin code)
    </th>
    <th v-if="status=='pending'">
    Action
    </th>
    <th v-if="status!='pending'">
    Date
    </th>
    <th v-if="status!='pending'">
    Status
    </th>
    <th v-if="status!='pending'">
    Rating
    </th>
    </tr>
    <tr  v-for="customer in UserHistory" v-if="status=='pending'&&customer?.service_request?.service_status=='pending'">
    <td>{{customer?.service_request?.service_request_id}}</td>
    <td>{{customer?.user?.user_name}}</td>
    <td>{{customer?.user?.email}}</td>
    <td>{{customer?.user?.address+customer?.user?.pincode}}</td>
    <td><span @click="approvalOrRejected(customer?.service_request?.service_request_id,'approved')">Approve</span>/<span @click="approvalOrRejected(customer?.service_request?.service_request_id,'rejected')">Reject</span></td>
    </tr>
    <tr  v-for="customer in UserHistory" v-if="status!='pending'&&customer?.service_request?.service_status!='pending'">
    <td>{{customer?.service_request?.service_request_id}}</td>
    <td>{{customer?.user?.user_name}}</td>
    <td>{{customer?.user?.email}}</td>
    <td>{{customer?.user?.address+customer?.user?.pincode}}</td>
    <td>{{customer?.service_request?.date_of_register}}</td>
    <td>{{customer?.service_request?.service_status}}</td>
    <td>{{customer?.service_request?.remarks}}</td>
    </tr>

    </table>
    </div>
    `
}