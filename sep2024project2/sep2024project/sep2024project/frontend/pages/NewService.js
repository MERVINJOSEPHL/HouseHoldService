import router from "../utils/router.js"
export default{
    template:`
    <div>
    <input type="text" placeholder="Service" v-model="serviceName"/>
    <input type="text" placeholder="Description" v-model="description"/>
    <input type="number" placeholder='Base Price' v-model="baseprice"/>
    <input type="submit" v-if="!service_details" placeholder="Add Service" @click="addservice" value='New Service'/>
    <input type="submit" v-if="service_details" placeholder="Edit Service" @click="addservice" value='Edit submit'></input>
    </div>`,
    data(){
        return{
            service_details:null,
            serviceName:null,
            description:null,
            baseprice:null,
            role:"admin"
        }
    },
    mounted(){
        this.service_details = this.$route.query.service_details;
        if(this.service_details){
            this.serviceName=this.service_details.service_name
            this.description=this.service_details.description
            this.baseprice=this.service_details.base_price
        }
    },
    methods : {
        async addservice() {
            var methodvalnewservice='POST'
            var responsenewservice={
                serviceName:this.serviceName,
                description:this.description,
                baseprice:this.baseprice,
                role:"admin"
            }
            if(this.service_details){
                methodvalnewservice='PUT'
                responsenewservice.service_id=this.service_details.service_id
            }
            const res = await fetch(location.origin + '/api/newservices', {
                method: methodvalnewservice,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Token': this.$store.state.auth_token
                },
                body: JSON.stringify(responsenewservice)
            });
        
            if (res.ok) {
                console.log('We are registered');
            } else {
                const errorData = await res.json();
                console.error('Error:', errorData);
            }
            router.push("/admindashboard")
        }
    }
}