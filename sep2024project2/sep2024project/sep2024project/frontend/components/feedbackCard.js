export default{
    props:["data","feedback"],
    template:`<div>
    <div>
    <label for="service_name">Service Name:</label>
    <input id="service_name"type='text' disabled :placeholder="data.user.service_name"/>
    </div>
    <div>
    <label for="service_name">StartDate:</label>
    <input id="service_name"type='text' disabled :placeholder="formattedDate(data.service_request.date_of_register)"/>
    </div>
    <div>
    <label for="service_name">Professional ID:</label>
    <input id="service_name"type='text' disabled :placeholder="data.user.userid"/>
    </div>
    <div>
    <label for="service_name">Professional Name:</label>
    <input id="service_name"type='text' disabled :placeholder="data.user.user_name"/>
    </div>
    <div>
    <label for="service_name">Email:</label>
    <input id="service_name"type='text' disabled :placeholder="data.user.email"/>
    </div>
    <div class="star-rating">
    <span
      v-for="starvalue in 5"
      :key="starvalue"
      :class="{ filled: starvalue <= ratingvalue }"
      :style="{
        color: starvalue <= (hoverRatingvalue || ratingvalue) ? 'gold' : 'gray',
        fontSize: '2em',
        cursor: 'pointer'
      }"
      @click="setRating(starvalue)"
      @mouseover="hoverRatingvalue = starvalue"
      @mouseleave="hoverRatingvalue = 0"
    >
      ★
    </span>
    <input type="hidden" v-model="ratingvalue" />
  </div>
  <div>
    <label for="service_name">Description:</label>
    <input id="service_name"type='text'  placeholder="Any Description" v-model="remarks"/>
    </div>
    <button  class="text-primary" @click="feedback([])">Cancel</button>
    <button  class="text-warning" @click="submitfeedback()">Save</button>
    </div>`,
    data() {
        return {
          ratingvalue: 0,         
          hoverRatingvalue: 0,
          remarks:""      
        };
      },
      methods: {
        setRating(value) {
          this.ratingvalue = value; 
        },
        formattedDate(date){
            return new Date(date).toLocaleString();
        },
        async submitfeedback(){
            const requestbody={
                'service_request_id':this.data.service_request.service_request_id,
            'customer_id':this.data.service_request.user_id,
            'service_provider_id':this.data.service_request.service_provider_id,
            'contact_number':this.$store.state.email,
            'rating':this.ratingvalue,
            'description':this.remarks
            }
            const res = await fetch(`${location.origin}/api/feedbackprocess`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Token': this.$store.state.auth_token
                },
                body: JSON.stringify(requestbody)
              });
            this.feedback([]);

        },
        
    }
      }