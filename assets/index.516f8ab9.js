import{S as n,P as e,W as o,a as t,A as i,b as s,G as a,T as d,M as r,c as w,B as c,d as l,e as p,O as f,f as u,g as h,C as m}from"./vendor.9af5006b.js";const g=new n,y=new e(75,window.innerWidth/window.innerHeight,.1,1e3);y.position.set(5,5,5),y.lookAt(0,0,0);const A=new o({canvas:document.querySelector("#bg")});A.setPixelRatio(window.devicePixelRatio),A.setSize(window.innerWidth,window.innerHeight),A.render(g,y);const x=new t(16777215);x.position.set(10,10,10);const z=new i(8421504);g.add(x,z),new s(x);const S=new a(200,50);g.add(S);const W=new d(5,.5,16,100),b=new r({color:16737095}),v=new w(W,b);g.add(v);const H=new c(5,.5,5),M=new r({color:15592144}),P=new w(H,M);P.position.set(0,-.25,0),g.add(P);const j=new l;let q,E;const F=new m;j.load("resources/faceless.glb",(function(n){E=n.scene,g.add(E),q=new p(E),idle=q.clipAction(n.animations[1]).play()}),void 0,(function(n){console.error(n)})),Array(200).fill().forEach((function(){const n=new u(.25,24,24),e=new r({color:16777215}),o=new w(n,e),[t,i,s]=Array(3).fill().map((()=>h.randFloatSpread(100)));o.position.set(t,i,s),g.add(o)}));const R=new f(y,A.domElement);window.onresize=function(){y.aspect=window.innerWidth/window.innerHeight,y.updateProjectionMatrix(),A.setSize(window.innerWidth,window.innerHeight)};let k=0;!function n(){requestAnimationFrame(n),v.rotation.x+=.01,v.rotation.y+=.005,v.rotation.z+=.01,k=359==k?0:k+.01,E.position.x=2*Math.cos(k),E.position.z=2*Math.sin(k),E.rotation.y+=.05;const e=F.getDelta();q.update(e),R.update(),A.render(g,y)}();
