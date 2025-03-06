import o,{code,fmt}from'@shado-network/client-telegram';var s=class{config={};secrets;client;_context;constructor(t,e,n){this._context=n,this.config={...this.config,...t},this.secrets={...e},this._init();}_init=async()=>{try{let t={id:"sandbox",name:"Shad\u014D Puppet Sandbox",bio:void 0},e={logger:void 0,sandbox:this};this.client=new o(this.config,this.secrets,t,e);}catch(t){this._context.utils.logger.send({type:"ERROR",origin:{type:"SERVER"},data:{message:"Could not start Telegram sandbox client",payload:{error:t}}});}};_composeTelegramMessage=async t=>{let e=fmt`
  [ PUPPET / ${t.origin.id?.toUpperCase()} ]
  ${t.data.message}
  
  PAYLOAD: 
  ${code`${JSON.stringify(t.data.payload||null,null,2)}`}
  `;await this.client.sendMessage(e,this.secrets.chatId);};send=async t=>{await this._composeTelegramMessage(t);}};export{s as SandboxTelegramClient};