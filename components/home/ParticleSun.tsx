"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@/components/motion";
import { reducedMotion } from "@/components/ui";

/* The sun behind the portfolio wall, as particles (client request, 2026-10-09: "not just a circle, blasting
   particles, scroll animated"). BlueYard's glowing sphere is the look; Three.js draws it as ~26k points.

   Each point has a home on a sphere (most of them close to the surface), a random escape direction and four random
   numbers (size, speed, delay, flare). The vertex shader does all the motion:
     living surface  simplex noise breathes the surface in and out (±7%)
     flares          about a fifth of the points stream outward along their normal, fade, and start again: the sun
                     is always throwing particles off
     assemble        scroll in: the points fly in from a scattered cloud and settle on the sphere, each on its own
                     delay, so the sun forms as the wall arrives (wall progress 0 to .42)
     blast           scroll out: the sphere blows apart along the escape directions (wall progress .68 to 1)
   Underneath, a soft Dawn glow (.wall-sun, sized to the sphere by --sun-d) gives the sun a body that reads through
   the gaps between tiles; its strength (--sun-a) follows assemble × (1 − blast). Colour comes from the palette only: deep Dawn on the shadow side, Dawn, and pale Dawn where the light falls (from
   the upper left, as BlueYard lights its orb). Normal alpha blending, so it reads on the Mist ground.

   Rendering only runs while the canvas is on screen. Reduced motion: one still frame of the formed sun. Without
   WebGL the CSS sun (.wall-sun) stays. three.js is loaded on demand, so it never delays the first paint. */

const VERTEX = /* glsl */ `
uniform float uTime, uAssemble, uBlast, uPixel, uSize;
uniform vec3 uDeep, uMid, uLight;
attribute vec3 aSphere;
attribute vec3 aDir;
attribute vec4 aRand;
varying vec3 vColor;
varying float vAlpha;

// Simplex 3D noise (Ashima Arts / Stefan Gustavson, MIT).
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main(){
  vec3 n = normalize(aSphere);
  float t = uTime;

  // Living surface.
  float w = snoise(aSphere * 1.6 + vec3(0., t * .22, t * .07));
  vec3 surface = aSphere * (1. + .07 * w);

  // Flares: points that stream off the surface and recycle.
  float flare = step(.8, aRand.w);
  float life = fract(t * (.08 + aRand.y * .22) + aRand.z * 7.);
  surface += n * flare * pow(life, 1.5) * (.7 + aRand.y * 1.6);

  // Scattered cloud the sun forms out of.
  vec3 scatter = aDir * (2.4 + aRand.y * 3.6);
  scatter += vec3(snoise(aDir * 2. + t * .08), snoise(aDir * 2. + 7. + t * .08), snoise(aDir * 2. + 13.)) * .7;

  float a = smoothstep(0., 1., clamp(uAssemble * 1.5 - aRand.z * .5, 0., 1.));
  vec3 pos = mix(scatter, surface, a);

  // Blast on the way out.
  float b = smoothstep(0., 1., clamp(uBlast * 1.4 - aRand.z * .4, 0., 1.));
  pos += aDir * b * (1.4 + aRand.y * 5.) + n * b * b * 1.2;

  vec4 mv = modelViewMatrix * vec4(pos, 1.);
  gl_Position = projectionMatrix * mv;
  float size = uSize * (.35 + aRand.x) * (1. + flare * (1. - life) * .5);
  gl_PointSize = size * uPixel / -mv.z;

  // Lit from the upper left.
  float lit = clamp(dot(n, normalize(vec3(-.55, .6, .6))) * .5 + .5, 0., 1.);
  vec3 c = mix(uDeep, uMid, smoothstep(.12, .62, lit));
  c = mix(c, uLight, smoothstep(.7, 1., lit));
  vColor = mix(c, uLight, flare * life * .5);
  vAlpha = (.3 + .7 * a) * (1. - b * .9) * (1. - flare * smoothstep(.5, 1., life));
}`;

const FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - .5);
  if (d > .5) discard;
  gl_FragColor = vec4(vColor, smoothstep(.5, .06, d) * vAlpha);
}`;

// Palette (app/globals.css) as raw sRGB 0..1, mixed the same way color-mix does.
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v * (1 - t) + b[i] * t);
const DAWN = rgb("#EC790C"), INK = rgb("#272727"), WHITE = [1, 1, 1];

export function ParticleSun() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current; if (!el) return;
    let dead = false;
    let cleanup = () => {};

    void import("three").then((THREE) => {
      if (dead) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" }); }
      catch { return; } // no WebGL: the CSS sun stays
      const still = reducedMotion();
      const small = window.matchMedia("(max-width: 760px)").matches;
      const COUNT = small ? 22000 : 60000;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);
      el.closest(".wall")?.classList.add("has-gl");

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);

      // Attributes.
      const sphere = new Float32Array(COUNT * 3), dir = new Float32Array(COUNT * 3), rand = new Float32Array(COUNT * 4);
      const v = new THREE.Vector3();
      for (let i = 0; i < COUNT; i++) {
        v.randomDirection();
        const r = 1 - Math.pow(Math.random(), 3) * .38; // most points near the surface, some inside
        sphere.set([v.x * r, v.y * r, v.z * r], i * 3);
        const d = new THREE.Vector3().randomDirection().multiplyScalar(.6).add(v).normalize();
        dir.set([d.x, d.y, d.z], i * 3);
        rand.set([Math.pow(Math.random(), 3) * 1.05, Math.random(), Math.random(), Math.random()], i * 4); // size skews small: fine sparkle, a few larger motes
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(sphere, 3)); // bounds only; the shader moves the points
      geometry.setAttribute("aSphere", new THREE.BufferAttribute(sphere, 3));
      geometry.setAttribute("aDir", new THREE.BufferAttribute(dir, 3));
      geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));

      const uniforms = {
        uTime: { value: 0 }, uAssemble: { value: still ? 1 : 0 }, uBlast: { value: 0 },
        uPixel: { value: dpr }, uSize: { value: small ? 19 : 22 },
        uDeep: { value: new THREE.Vector3(...mix(DAWN, INK, .32)) },
        uMid: { value: new THREE.Vector3(...DAWN) },
        uLight: { value: new THREE.Vector3(...mix(DAWN, WHITE, .62)) },
      };
      const material = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms, transparent: true, depthWrite: false });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);

      /* Size: the sphere fills about 80% of the canvas height (it spills past the tile grid's top and bottom edges,
         so it reads around the tiles, not only in the gaps) and at most 96% of the width. The diameter is handed to
         CSS (--sun-d) so the glow body underneath matches it. */
      const wall = el.closest<HTMLElement>(".wall");
      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight; if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const half = Math.tan((camera.fov / 2) * Math.PI / 180);
        const byHeight = 1 / (.8 * half), byWidth = 1 / (.96 * half * camera.aspect);
        camera.position.z = Math.max(byHeight, byWidth);
        camera.updateProjectionMatrix();
        wall?.style.setProperty("--sun-d", `${Math.round(h / (camera.position.z * half))}px`);
      };
      resize();
      const ro = new ResizeObserver(resize); ro.observe(el);

      // Scroll: progress through the wall drives assembly, turn and blast (smoothed in the loop).
      const target = { assemble: still ? 1 : 0, blast: 0, turn: 0 };
      const st = still ? null : ScrollTrigger.create({
        trigger: el.closest(".wall") ?? el, start: "top 95%", end: "bottom 5%",
        onUpdate: (self) => {
          const p = self.progress;
          target.assemble = Math.min(1, p / .42);
          target.blast = Math.max(0, (p - .68) / .32);
          target.turn = p * 1.4;
        },
      });

      // Pointer: a slight tilt towards the cursor.
      const tilt = { x: 0, y: 0 };
      const onMove = (e: PointerEvent) => { tilt.x = (e.clientY / window.innerHeight - .5) * .35; tilt.y = (e.clientX / window.innerWidth - .5) * .5; };
      if (!still) window.addEventListener("pointermove", onMove, { passive: true });

      const render = (time: number) => {
        const t = time / 1000;
        uniforms.uTime.value = t;
        const k = .08;
        uniforms.uAssemble.value += (target.assemble - uniforms.uAssemble.value) * k;
        uniforms.uBlast.value += (target.blast - uniforms.uBlast.value) * k;
        points.rotation.y += ((t * .06 + target.turn + tilt.y) - points.rotation.y) * k;
        points.rotation.x += ((-.15 + tilt.x) - points.rotation.x) * k;
        // The glow body underneath swells as the sun forms and fades as it blasts apart.
        wall?.style.setProperty("--sun-a", (uniforms.uAssemble.value * (1 - uniforms.uBlast.value)).toFixed(3));
        renderer.render(scene, camera);
      };

      let raf = 0;
      const loop = (time: number) => { render(time); raf = requestAnimationFrame(loop); };
      const io = new IntersectionObserver(([entry]) => {
        const visible = entry.isIntersecting;
        if (still) { if (visible) { points.rotation.set(-.15, .6, 0); render(4000); } return; }
        if (visible && !raf) raf = requestAnimationFrame(loop);
        if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
      }, { rootMargin: "100px" });
      io.observe(el);

      cleanup = () => {
        io.disconnect(); ro.disconnect(); st?.kill(); cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onMove);
        geometry.dispose(); material.dispose(); renderer.dispose();
        renderer.domElement.remove(); wall?.classList.remove("has-gl"); wall?.style.removeProperty("--sun-a"); wall?.style.removeProperty("--sun-d");
      };
    });

    return () => { dead = true; cleanup(); };
  }, []);

  return <div className="wall-gl" ref={host} aria-hidden="true" />;
}
