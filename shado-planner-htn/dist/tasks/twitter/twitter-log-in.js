var s={identifier:"twitter-log-in",description:"Log in to Twitter.",conditions:{"twitter-has-client":t=>t._origin.memory.state?.["twitter-has-client"]===true,"twitter-has-logged-in":t=>t._origin.memory.state?.["twitter-has-logged-in"]===false,"twitter-last-log-in":t=>t._origin.memory.state?.["twitter-last-log-in-attempt"]<=Date.now()-1*6e4},effects:{"twitter-has-logged-in":{value:t=>true,trigger:async t=>(t._origin.memory.state["twitter-has-logged-in"]=true,{success:true,payload:void 0})},"twitter-last-log-in-attempt":{value:t=>t._origin.memory.state?.["twitter-log-in-try"]<=Date.now()-1*6e4,trigger:async t=>(t._origin.memory.state["twitter-last-log-in-attempt"]=Date.now(),{success:true,payload:void 0})}},actions:{"twitter-log-in":async t=>{t._origin.memory.state["twitter-last-log-in-attempt"]=Date.now();try{return await t._origin.clients.twitter.login()===!0?{success:!0,payload:void 0}:{success:!1,payload:void 0}}catch(e){return {success:false,payload:e}}}}};export{s as default};