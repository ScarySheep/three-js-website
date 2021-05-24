import{S as e,T as n,R as t,P as o,W as i,a,A as r,G as s,b as l,c,M as v,D as m,d,L as u,C as p,V as g,e as f,f as x,B as w,g as h,h as y,i as b,I as _,j as D}from"./vendor.ffb6bd41.js";var F="uniform float time;\n\nuniform float fogDensity;\nuniform vec3 fogColor;\n\nuniform sampler2D texture1;\nuniform sampler2D texture2;\n\nvarying vec2 vUv;\n\nvoid main( void ) {\n\nvec2 position = - 1.0 + 2.0 * vUv;\n\nvec4 noise = texture2D( texture1, vUv );\nvec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;\nvec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;\n\nT1.x += noise.x * 2.0;\nT1.y += noise.y * 2.0;\nT2.x -= noise.y * 0.2;\nT2.y += noise.z * 0.2;\n\nfloat p = texture2D( texture1, T1 * 2.0 ).a;\n\nvec4 color = texture2D( texture2, T2 * 2.0 );\nvec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );\n\nif( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }\nif( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }\nif( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }\n\ngl_FragColor = temp;\n\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n\n}",P="uniform vec2 uvScale;\nvarying vec2 vUv;\n\nvoid main()\n{\n\nvUv = uvScale * uv;\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\ngl_Position = projectionMatrix * mvPosition;\n\n}";const S=new e,M=new D,C=new n,T=C.load("/three-js-website/assets/cloud.aab284a9.png"),z=C.load("/three-js-website/assets/lavatile.8dd33ecf.jpg"),j=C.load("/three-js-website/assets/coldtile.31316a63.jpg"),U=C.load("/three-js-website/assets/darktile.d51bb4ad.jpg");T.wrapS=T.wrapT=t,z.wrapS=z.wrapT=t,j.wrapS=j.wrapT=t,U.wrapS=U.wrapT=t;const O=new o(75,window.innerWidth/window.innerHeight,.1,1e3);O.position.set(0,0,0),O.rotation.x=Math.PI;const Z=new i({canvas:document.querySelector("#bg"),antialias:!0});Z.setPixelRatio(window.devicePixelRatio),Z.setSize(window.innerWidth,window.innerHeight);const I=new a(16777215);I.position.set(10,10,10);const V=new r(8421504);S.add(I,V),new s(200,50);let k={time:{value:1},uvScale:{value:new b(3,1)},texture1:{value:T},texture2:{value:j}};const G=new l({uniforms:k,vertexShader:P,fragmentShader:F}),L=new c(13,6,30,30),W=new v(L,G);W.position.set(0,0,60),S.add(W);const A=new Uint8Array(2097152);let B=0;const H=new _,N=new g;for(let re=0;re<128;re++)for(let e=0;e<128;e++)for(let n=0;n<128;n++){const t=1-N.set(n,e,re).subScalar(64).divideScalar(128).length();A[B]=(128+128*H.noise(.05*n/1.5,.05*e,.05*re/1.5))*t*t,B++}const R=new m(A,128,128,128);R.format=d,R.minFilter=u,R.magFilter=u,R.unpackAlignment=1;const q=new f({glslVersion:x,uniforms:{base:{value:new p(7965344)},map:{value:R},cameraPos:{value:new g},threshold:{value:.25},opacity:{value:.3},range:{value:.05},steps:{value:5},frame:{value:0}},vertexShader:"in vec3 position;\nuniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec3 cameraPos;\nout vec3 vOrigin;\nout vec3 vDirection;\nvoid main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;\n    vDirection = position - vOrigin;\n    gl_Position = projectionMatrix * mvPosition;\n}",fragmentShader:"precision highp float;\nprecision highp sampler3D;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nin vec3 vOrigin;\nin vec3 vDirection;\nout vec4 color;\nuniform vec3 base;\nuniform sampler3D map;\nuniform float threshold;\nuniform float range;\nuniform float opacity;\nuniform float steps;\nuniform float frame;\nuint wang_hash(uint seed)\n{\n        seed = (seed ^ 61u) ^ (seed >> 16u);\n        seed *= 9u;\n        seed = seed ^ (seed >> 4u);\n        seed *= 0x27d4eb2du;\n        seed = seed ^ (seed >> 15u);\n        return seed;\n}\nfloat randomFloat(inout uint seed)\n{\n        return float(wang_hash(seed)) / 4294967296.;\n}\nvec2 hitBox( vec3 orig, vec3 dir ) {\n    const vec3 box_min = vec3( - 0.5 );\n    const vec3 box_max = vec3( 0.5 );\n    vec3 inv_dir = 1.0 / dir;\n    vec3 tmin_tmp = ( box_min - orig ) * inv_dir;\n    vec3 tmax_tmp = ( box_max - orig ) * inv_dir;\n    vec3 tmin = min( tmin_tmp, tmax_tmp );\n    vec3 tmax = max( tmin_tmp, tmax_tmp );\n    float t0 = max( tmin.x, max( tmin.y, tmin.z ) );\n    float t1 = min( tmax.x, min( tmax.y, tmax.z ) );\n    return vec2( t0, t1 );\n}\nfloat sample1( vec3 p ) {\n    return texture( map, p ).r;\n}\nfloat shading( vec3 coord ) {\n    float step = 0.01;\n    return sample1( coord + vec3( - step ) ) - sample1( coord + vec3( step ) );\n}\nvoid main(){\n    vec3 rayDir = normalize( vDirection );\n    vec2 bounds = hitBox( vOrigin, rayDir );\n    if ( bounds.x > bounds.y ) discard;\n    bounds.x = max( bounds.x, 0.0 );\n    vec3 p = vOrigin + bounds.x * rayDir;\n    vec3 inc = 1.0 / abs( rayDir );\n    float delta = min( inc.x, min( inc.y, inc.z ) );\n    delta /= steps;\n    // Jitter\n    // Nice little seed from\n    // https://blog.demofox.org/2020/05/25/casual-shadertoy-path-tracing-1-basic-camera-diffuse-emissive/\n    uint seed = uint( gl_FragCoord.x ) * uint( 1973 ) + uint( gl_FragCoord.y ) * uint( 9277 ) + uint( frame ) * uint( 26699 );\n    vec3 size = vec3( textureSize( map, 0 ) );\n    float randNum = randomFloat( seed ) * 2.0 - 1.0;\n    p += rayDir * randNum * ( 1.0 / size );\n    //\n    vec4 ac = vec4( base, 0.0 );\n    for ( float t = bounds.x; t < bounds.y; t += delta ) {\n        float d = sample1( p + 0.5 );\n        d = smoothstep( threshold - range, threshold + range, d ) * opacity;\n        float col = shading( p + 0.5 ) * 3.0 + ( ( p.x + p.y ) * 0.25 ) + 0.2;\n        ac.rgb += ( 1.0 - ac.a ) * d * col;\n        ac.a += ( 1.0 - ac.a ) * d;\n        if ( ac.a >= 0.95 ) break;\n        p += rayDir * delta;\n    }\n    color = ac;\n    if ( color.a == 0.0 ) discard;\n}",side:w,transparent:!0}),E=new h(1,1,1);function J(e,n,t){const o=new v(E,q);o.position.set(e,n,t),o.scale.set(50,50,50),S.add(o)}J(20,20,50),J(-30,-15,40),J(30,-30,70),window.onresize=function(){O.aspect=window.innerWidth/window.innerHeight,O.updateProjectionMatrix(),Z.setSize(window.innerWidth,window.innerHeight)};let K={time:{value:10},uvScale:{value:new b(2,1)},texture1:{value:T},texture2:{value:U}};const Q=new l({uniforms:K,vertexShader:P,fragmentShader:F}),X=new y(500,8,8,0,2*Math.PI,0,Math.PI),Y=new v(X,Q);Y.rotation.x=.5*Math.PI,Y.material.side=w,S.add(Y);let $={clippingZ:{value:33},time:{value:1},uvScale:{value:new b(2,1)},texture1:{value:T},texture2:{value:z}};const ee=new l({uniforms:$,vertexShader:"uniform vec2 uvScale;\nvarying vec2 vUv;\nvarying vec4 worldPosition;\nvoid main()\n{\n\nvUv = uvScale * uv;\nvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\nworldPosition = modelMatrix * vec4(position, 1.0);\ngl_Position = projectionMatrix * mvPosition;\n}",fragmentShader:"uniform float clippingZ;\n\nuniform float time;\n\nuniform float fogDensity;\nuniform vec3 fogColor;\n\nuniform sampler2D texture1;\nuniform sampler2D texture2;\n\nvarying vec2 vUv;\nvarying vec4 worldPosition;\n\nvoid main( void ) {\nif(worldPosition.z>clippingZ){\ndiscard;\n}else{\nvec2 position = - 1.0 + 2.0 * vUv;\n\nvec4 noise = texture2D( texture1, vUv );\nvec2 T1 = vUv + vec2( 1.5, - 1.5 ) * time * 0.02;\nvec2 T2 = vUv + vec2( - 0.5, 2.0 ) * time * 0.01;\n\nT1.x += noise.x * 2.0;\nT1.y += noise.y * 2.0;\nT2.x -= noise.y * 0.2;\nT2.y += noise.z * 0.2;\n\nfloat p = texture2D( texture1, T1 * 2.0 ).a;\n\nvec4 color = texture2D( texture2, T2 * 2.0 );\nvec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );\n\nif( temp.r > 1.0 ) { temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }\nif( temp.g > 1.0 ) { temp.rb += temp.g - 1.0; }\nif( temp.b > 1.0 ) { temp.rg += temp.b - 1.0; }\n\ngl_FragColor = temp;\n\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n}\n}",side:w});const ne=new y(15,16,16,0,2*Math.PI,0,1*Math.PI),te=new v(ne,ee);te.rotation.x=-.5*Math.PI,S.add(te);let oe=0,ie=!1;window.ontouchstart=function(){ie?(ie=!1,$.clippingZ.value=-33,$.time.value=1):(oe=0,ie=!0)};let ae=document.getElementById("click");window.onmousedown=function(){ie?$.clippingZ.value<=15&&(ae.style.display="block",ie=!1,$.clippingZ.value=33,$.time.value=1):(ae.textContent="Click",ae.style.display="none",oe=0,ie=!0)},function e(){requestAnimationFrame(e);const n=M.getDelta();k.time.value+=2*n,K.time.value-=.1*n,$.time.value+=1*n,oe+=1,ie&&$.clippingZ.value>=-15&&($.time.value-=5e-6*oe*oe,$.clippingZ.value-=3e-4*oe,$.clippingZ.value<20&&($.clippingZ.value-=.0015*oe)),Z.render(S,O),1/n<30&&console.log(1/n)}();
