var t={identifier:"telegram-get-messages",description:"Retrieve messages received on Telegram.",conditions:{"telegram-has-client":e=>e._origin.memory.state?.["telegram-has-client"]===true,"telegram-has-messages":e=>e._origin.memory.state?.["telegram-has-messages"]===false},effects:{"telegram-has-messages":{value:e=>true,trigger:async e=>(e._origin.memory.state["telegram-has-messages"]=e._origin.memory.state?.["telegram-messages"]?.length>0,{success:true,payload:void 0})}},actions:{"telegram-get-messages":async e=>{try{let s=e._origin.clients.telegram.getMessages();return e._origin.memory.state["telegram-messages"]=s,{success:!0,payload:s}}catch(s){return {success:false,payload:s}}}}};export{t as default};