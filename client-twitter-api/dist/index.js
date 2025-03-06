import {TwitterApi}from'twitter-api-v2';var s=class{static metadata={identifier:"client-twitter-api",description:"Basic Twitter API client.",key:"twitter"};config={};secrets={};client;threads=[];messages=[];_puppet;_context;constructor(t,e,i,r){this._context=r,this._puppet=i,this.config={...this.config,...t},this.secrets={...this.secrets,...e};}login=async()=>{try{let t={appKey:this.secrets.appKey||"UNDEFINED",appSecret:this.secrets.appSecret||"UNDEFINED",accessToken:this.secrets.accessToken||"UNDEFINED",accessSecret:this.secrets.accessSecret||"UNDEFINED"},e={};return this.client=new TwitterApi(t,e),!0}catch(t){return this._context.utils.logger.send({type:"ERROR",origin:{type:"PUPPET",id:this._puppet.id},data:{message:"Error connecting to Twitter bot",payload:{error:t}}}),false}};getMessageThreads=()=>this.threads;addMessageThread=t=>{this.threads.push(t);};sendMessage=async t=>{if(this._context.config.sandboxMode){this._context.utils.sandbox.send({type:"SANDBOX",origin:{type:"PUPPET",id:this._puppet.id},data:{message:"client-twitter-api | sendMessage()",payload:{message:t}}});return}await this.client?.v2.tweet(t);}},p=s;export{p as default};