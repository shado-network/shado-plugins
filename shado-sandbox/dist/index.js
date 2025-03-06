import a,{code,fmt}from'@shado-network/client-telegram';var e=class{config={};secrets;client;_context;constructor(t,s,n){this._context=n,this.config={...this.config,...t},this.secrets={...s},this._init();}_init=async()=>{try{let t={id:"sandbox",name:"Shad\u014D Puppet Sandbox",bio:void 0},s={logger:void 0,sandbox:this};this.client=new a(this.config,this.secrets,t,s);}catch(t){this._context.utils.logger.send({type:"ERROR",origin:{type:"SERVER"},data:{message:"Could not start Telegram sandbox client",payload:{error:t}}});}};_composeTelegramMessage=async t=>{let s=fmt`
  [ PUPPET / ${t.origin.id?.toUpperCase()} ]
  ${t.data.message}
  
  PAYLOAD: 
  ${code`${JSON.stringify(t.data.payload||null,null,2)}`}
  `;await this.client.sendMessage(s,this.secrets.chatId);};send=async t=>{await this._composeTelegramMessage(t);}};var i=class{static metadata={identifier:"shado-sandbox",description:"Shad\u014D Network's sandbox environment utility.",key:"sandbox"};config={};secrets;clients=[];_context;constructor(t,s,n){this.secrets={...s},this._context=n,this._setClients(t),this._context.utils.logger.send({type:"SUCCESS",origin:{type:"PLUGIN"},data:{message:"Started Shad\u014D Sandbox"}});}_setClients=t=>{t.forEach(s=>{switch(s){case "shado-screen":break;case "logger":this.clients.push(this._context.utils.logger);break;case "telegram":this.clients.push(new e(this.config,this.secrets,this._context));break}});};send=t=>{this.clients.forEach(s=>{s.send(t);});}},b=i;export{b as default};