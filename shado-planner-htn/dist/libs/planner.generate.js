var p=async(n,t)=>{for(let e=0;e<n.length;e++)await t(n[e],e,n);};var _=async(n,t,e)=>{let i=[],u=[],s=[];return t.memory.goals.forEach(r=>{r.evaluator({_origin:t,_context:e})?u.push(r):s.push(r);}),t.events.emit("planner",{timestamp:Date.now(),origin:"shado-planner-htn",data:{identifier:"puppetGoals",goals:{reached:u,unreached:s}}}),s.length===0||await p(s,async r=>{let l=n.filter(o=>!!o.effects[r.identifier]);if(l.length===0)return;let a=[];await p([l.at(0)],async o=>{let c=await y(true,o,[],n,t,e);c&&c!==null&&c.length>0&&a.push(c);}),i.push(...a);}),i},y=async(n,t,e,i,u,s)=>{if(!n||!t)return n=false,null;let r=[],l=[];return Object.keys(t.conditions).forEach(a=>{t.conditions[a]({_origin:{...u},_context:s})?r.push(a):l.push(a);}),l.length===0?(n=true,[t]):(l.forEach(async a=>{let o=i.filter(c=>{let f=c.effects[a]?.value({_origin:{...u},_context:s});return Object.keys(c.effects).includes(a)&&f});return o.length===0?(n=false,null):(e.push(o[0]),await y(n,o[0],e,i,u,s))}),n?(n=true,[t,...e].reverse()):(n=false,[]))};export{_ as generatePlans};