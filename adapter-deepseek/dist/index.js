import {ChatOpenAI}from'@langchain/openai';var n=class{static metadata={identifier:"adapter-deepseek",description:"Wrapper for DeepSeek interaction through LangChain.",key:"model"};config={model:"deepseek-chat",temperature:1,maxTokens:256,baseURL:"https://api.deepseek.com"};adapter;_memoryClient;_puppet;_context;constructor(t,a,e,s){this._context=s,this._puppet=e,this.adapter=new ChatOpenAI({...this.config,...t,...a}),this._memoryClient=this._puppet._memoryClient(this.adapter);}getMessagesResponse=async(t,a)=>{let e=await this._memoryClient.invoke({messages:t},{configurable:{thread_id:a.thread}});return (!e||!e.messages||e.messages.length===0)&&this._context.utils.logger.send({type:"WARNING",origin:{type:"SERVER"},data:{message:"Error parsing response",payload:{content:e.content}}}),e.messages[e.messages.length-1].content}},r=n;
export{r as default};